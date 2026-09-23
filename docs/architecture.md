Odysseus Architecture

Project: Odysseus
Version: v0.2 — Local Full-Stack MVP
Status: Local browser extension + FastAPI backend working
Last Updated: 2026-09-23

---

1. Overview

Odysseus is a browser security analysis application designed to inspect the currently active webpage and produce structured security observations and findings.

The project is being developed in stages:

Browser Security Analysis
        ↓
Local FastAPI Backend
        ↓
Azure Cloud Deployment
        ↓
Microsoft Entra ID
        ↓
Cloud Security & Monitoring
        ↓
DevSecOps

The current milestone is the Local Full-Stack MVP.

Current Data Flow

The complete local flow is:

1. User opens webpage

2. User opens Odysseus

3. popup.js requests page information

4. content.js analyzes the DOM

5. service_worker.js obtains browser/network-level
   information such as response headers

6. popup.js combines the observations

7. Browser-side findings are generated

8. popup.js creates the backend request

9. POST /analyze is sent to FastAPI

10. FastAPI validates the request

11. Backend analysis runs

12. Backend returns structured JSON

13. popup.js receives the response

14. Backend status/risk is displayed

The current architecture therefore represents:

Browser → Analysis → API → Analysis → Browser

---

Current Security Boundary

The most important current trust boundary is:

┌───────────────────────┐
│     Browser Client    │
│                       │
│  Extension + webpage │
└───────────┬───────────┘
            │
            │ API request
            ▼
┌───────────────────────┐
│      FastAPI API      │
│                       │
│ Validation            │
│ Backend analysis      │
└───────────────────────┘

At the current stage, the API is local and does not yet provide production authentication.

Therefore the local MVP should not be considered a production-secured cloud application.

---

Current Project Structure

The intended structure is:

odysseus/
│
├── extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── content.js
│   └── service_worker.js
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── docs/
│   └── architecture.md
│
└── README.md

The exact physical structure may evolve as the project grows.

The architectural separation is more important than forcing an immediate refactor.

---

What Exists

Browser extension

- [x] Manifest V3 extension
- [x] Popup interface
- [x] Content script
- [x] Service worker
- [x] Extension messaging
- [x] Page inspection
- [x] DOM/security observations
- [x] Security header inspection
- [x] Browser-side findings
- [x] Severity aggregation

Backend

- [x] FastAPI application
- [x] REST endpoint
- [x] Pydantic request validation
- [x] Security analysis
- [x] Structured JSON response
- [x] Extension → API integration
- [x] Backend result displayed in extension

Not yet implemented

- [ ] Azure deployment
- [ ] Production HTTPS endpoint
- [ ] Microsoft Entra ID
- [ ] API authentication
- [ ] API authorization/scopes
- [ ] Cloud persistence
- [ ] Cloud monitoring
- [ ] Production secret management
- [ ] CI/CD
- [ ] Automated security scanning
- [ ] Production hardening

---

Target Azure Architecture

The planned cloud architecture is:

                    ┌───────────────────┐
                    │ Chrome Extension  │
                    │     Odysseus      │
                    └─────────┬─────────┘
                              │
                              │ HTTPS
                              ▼
                    ┌───────────────────┐
                    │   Azure App       │
                    │     Service       │
                    │                   │
                    │     FastAPI       │
                    └─────────┬─────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
          ┌──────────┐  ┌───────────┐  ┌──────────┐
          │ Entra ID │  │ Analysis  │  │ Storage  │
          │ Identity │  │ Engine    │  │ / DB     │
          └──────────┘  └───────────┘  └──────────┘
                              │
                              ▼
                     ┌────────────────┐
                     │ Azure Monitor  │
                     │ / Logs         │
                     └────────────────┘

The exact Azure services for storage and supporting infrastructure will be selected when those requirements are implemented.

---

Future Authentication Flow

Authentication should be separated from page-security analysis.

Target flow:

Request
   │
   ▼
Authentication
   │
   ├── Invalid → 401
   │
   ▼
Authorization
   │
   ├── Insufficient permission → 403
   │
   ▼
Request validation
   │
   ▼
Security analysis
   │
   ▼
Response

The intended identity architecture uses Microsoft Entra ID.

Conceptually:

User
  ↓
Odysseus Extension
  ↓
Microsoft Entra ID
  ↓
Access Token
  ↓
FastAPI
  ↓
Token Validation
  ↓
Authorized Analysis

This introduces practical concepts including:

- OAuth 2.0
- OpenID Connect
- Access tokens
- JWTs
- Application registrations
- API scopes
- Authentication
- Authorization

---

Future Persistence

Persistence should only be introduced when there is a concrete requirement for it.

A possible future model is:

User
 │
 └── Analysis
      ├── URL
      ├── timestamp
      ├── risk
      ├── findings
      └── summary

Potential functionality:

Current analysis
      ↓
Save
      ↓
Analysis history
      ↓
Previous results

No specific database is considered mandatory at the current MVP stage.

---

Future Monitoring

The cloud application can eventually provide:

Extension
    ↓
FastAPI
    ↓
Application logs
    ↓
Azure monitoring

Potential telemetry includes:

- API requests
- HTTP errors
- authentication failures
- exceptions
- response times
- availability
- unusual request patterns

Monitoring should support both application reliability and security visibility.

---

Future DevSecOps Pipeline

The intended development pipeline is:

Developer
    ↓
Git
    ↓
GitHub
    ↓
GitHub Actions
    │
    ├── Tests
    ├── Linting
    ├── Dependency checks
    ├── Security scanning
    └── Build
          ↓
       Deployment
          ↓
        Azure

Security should eventually become part of the development pipeline rather than being performed only after deployment.

Potential controls include:

- Automated tests
- Dependency scanning
- Secret detection
- Static analysis
- Container scanning, if containers are introduced
- Deployment gates
- Environment separation

---

Future Browser Security Research

The browser analysis engine can eventually become substantially more sophisticated.

Current conceptual model:

DOM
├── Sources
├── Sinks
├── URL parameters
├── URL fragments
├── Inline handlers
├── innerHTML
└── contenteditable

Future research direction:

Source
   ↓
Data flow
   ↓
Transformation
   ↓
Dangerous sink
   ↓
Potential vulnerability

This could support deeper investigation of client-side vulnerabilities such as DOM-based XSS.

The findings engine should distinguish between:

Observation
     ↓
Security indicator
     ↓
Potential issue
     ↓
Confirmed vulnerability

These should not automatically be treated as equivalent.

---

Architectural Principles

Odysseus should follow these principles as development continues:

Separation of concerns

content.js
    = DOM/page information

service_worker.js
    = browser/network information

popup.js
    = orchestration/presentation

FastAPI
    = backend validation/analysis

Azure
    = hosting/identity/infrastructure

Validate at boundaries

Data coming from the extension should be validated by the backend.

Authentication is separate from analysis

Identity should protect the API without becoming coupled to the security-analysis engine.

Do not introduce infrastructure without a requirement

Azure services should solve concrete application requirements rather than being added merely to make the architecture look larger.

Treat browser findings as analysis

A detected indicator does not automatically prove a vulnerability.

Secure the pipeline

Security should eventually exist throughout:

Development
    ↓
Build
    ↓
Deployment
    ↓
Runtime
    ↓
Monitoring

---

Current Milestone

Odysseus v0.2 — Local Full-Stack MVP

Definition of done:

[x] Browser extension analyzes page
[x] Security headers retrieved
[x] Browser findings generated
[x] FastAPI receives analysis
[x] FastAPI validates request
[x] FastAPI returns risk/findings
[x] Extension displays backend result
[ ] Git checkpoint

The next milestone begins after the working local implementation has been committed to Git.

Next major phase: Azure deployment.
