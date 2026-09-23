Odysseus

«A browser security analysis extension evolving into a cloud-based security application.»

Current version: v0.2 — Local Full-Stack MVP
Status: Working locally

---

Overview

Odysseus is a Chrome browser extension for inspecting the security characteristics of the currently active webpage.

It combines browser-side analysis with a FastAPI backend to produce structured security observations, findings, severity information, and risk summaries.

The long-term goal is to evolve Odysseus from a local browser extension into a small cloud security application incorporating:

- Microsoft Azure
- Microsoft Entra ID
- API security
- Cloud monitoring
- Persistent analysis history
- DevSecOps
- Advanced browser security analysis

---

Current Architecture

Chrome Extension
       │
       ├── content.js
       │      └── Page / DOM analysis
       │
       ├── service_worker.js
       │      └── Browser / HTTP information
       │
       └── popup.js
              │
              │ POST /analyze
              ▼
        FastAPI Backend
              │
              ├── Validation
              ├── Analysis
              ├── Findings
              └── Risk
              │
              ▼
        JSON Response
              │
              ▼
          Extension

---

Features

Page Analysis

Odysseus can currently inspect information including:

- Page title
- URL
- Domain
- Protocol
- HTTPS status
- Links
- External links
- Images
- Forms
- Scripts
- External scripts
- Iframes
- External iframes
- Videos
- Buttons
- Inputs
- Form details
- Iframe sources

DOM Security Indicators

The extension also examines indicators including:

- URL parameters
- URL hash
- Referrer
- Inline event handlers
- "contenteditable"
- DOM source/sink concepts
- "innerHTML" usage

HTTP Security Headers

Odysseus currently examines:

- Content-Security-Policy
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

Findings

Observations can be converted into structured findings such as:

[MEDIUM] Content Security Policy missing
[MEDIUM] Referrer Policy missing
[MEDIUM] X-Content-Type-Options missing
[MEDIUM] Inline event handlers detected
[LOW]    External scripts detected
[MEDIUM] External iframes detected

Findings are aggregated by severity:

HIGH
MEDIUM
LOW
INFO

---

Backend

The current backend is built with FastAPI.

Local API:

http://127.0.0.1:8000

Primary endpoint:

POST /analyze

The current request flow is:

Extension
    ↓
JSON
    ↓
FastAPI
    ↓
Pydantic validation
    ↓
Security analysis
    ↓
Structured JSON

Invalid request data is rejected through FastAPI validation.

---

Project Structure

The intended project structure is:

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

The exact structure may evolve as the application grows.

---

Running the Local Backend

From the backend directory, start FastAPI using the project's configured command.

For example:

uvicorn main:app --reload

The API should then be available at:

http://127.0.0.1:8000

The exact command may differ depending on the final backend package structure.

---

Loading the Extension

In Chrome:

chrome://extensions

Then:

1. Enable Developer mode.
2. Select Load unpacked.
3. Select the Odysseus extension directory.
4. Open a webpage.
5. Open Odysseus.
6. Run the page inspection.
7. Verify the browser-side findings.
8. Verify that the backend receives the analysis.
9. Verify the backend result is displayed.

---

Current MVP

Odysseus v0.2 establishes a complete local path:

Webpage
   ↓
Chrome Extension
   ↓
Page Analysis
   ↓
Browser Findings
   ↓
FastAPI
   ↓
Backend Validation
   ↓
Backend Analysis
   ↓
JSON Response
   ↓
Extension UI

This is the current working foundation.

---

Roadmap

Phase 1 — Browser Security

- [x] Manifest V3
- [x] Popup
- [x] Content scripts
- [x] Extension messaging
- [x] DOM analysis
- [x] Resource analysis
- [x] Security header analysis
- [x] Findings engine

Phase 2 — Backend

- [x] FastAPI
- [x] REST endpoint
- [x] Pydantic validation
- [x] Backend analysis
- [x] Structured findings
- [x] Extension → API communication
- [x] Backend result displayed in extension

Phase 3 — Azure

- [ ] Azure resource group
- [ ] Azure App Service
- [ ] FastAPI deployment
- [ ] HTTPS
- [ ] Environment configuration
- [ ] Extension → Azure API

Phase 4 — Identity

- [ ] Microsoft Entra ID
- [ ] App registration
- [ ] Authentication
- [ ] Access tokens
- [ ] API scopes
- [ ] FastAPI token validation
- [ ] Authorization

Phase 5 — Cloud Security

- [ ] Secret/configuration management
- [ ] Application logging
- [ ] Monitoring
- [ ] Alerts
- [ ] Access control
- [ ] Cloud security hardening

Phase 6 — DevSecOps

- [ ] GitHub
- [ ] GitHub Actions
- [ ] Automated tests
- [ ] Dependency scanning
- [ ] Security scanning
- [ ] Secret detection
- [ ] Automated deployment
- [ ] Security gates

Phase 7 — Advanced Security Research

- [ ] Deeper DOM analysis
- [ ] Source/sink tracking
- [ ] Data-flow analysis
- [ ] Improved vulnerability indicators
- [ ] More sophisticated findings
- [ ] Research/portfolio documentation

---

Target Architecture

The long-term architecture is:

                  ┌─────────────────────┐
                  │   Chrome Extension  │
                  │      Odysseus       │
                  └──────────┬──────────┘
                             │
                             │ HTTPS
                             ▼
                  ┌─────────────────────┐
                  │   Azure App Service │
                  │       FastAPI       │
                  └──────────┬──────────┘
                             │
             ┌───────────────┼───────────────┐
             ▼               ▼               ▼
        ┌─────────┐    ┌───────────┐    ┌─────────┐
        │ Entra ID│    │  Analysis │    │ Storage │
        │         │    │  Engine   │    │  / DB   │
        └─────────┘    └───────────┘    └─────────┘
                             │
                             ▼
                     ┌──────────────┐
                     │   Monitoring │
                     │    & Logs    │
                     └──────────────┘

---

Development Philosophy

Odysseus is being developed incrementally.

The project does not attempt to introduce Azure, identity, databases, monitoring, and CI/CD simultaneously.

Instead:

Working local application
          ↓
Cloud deployment
          ↓
Identity
          ↓
Cloud security
          ↓
DevSecOps
          ↓
Advanced security research

Each stage should produce a working system before the next architectural layer is introduced.

---

Security Considerations

The current local MVP should not be treated as a production deployment.

Important future security boundaries include:

Browser
   ↓
API
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Analysis
   ↓
Storage

Future versions should also address:

- API authentication
- Authorization
- CORS configuration
- Input validation
- Rate limiting
- Secret management
- Dependency security
- Logging
- Monitoring
- Abuse prevention
- Secure deployment configuration

---

Why Odysseus?

The project is intended to combine several areas of practical cybersecurity engineering:

Web Security
     +
Browser Security
     +
API Security
     +
Cloud Security
     +
Identity
     +
DevSecOps

Rather than building isolated demonstrations for each topic, Odysseus provides a single application through which these concepts can be progressively implemented.

---

Current Milestone

Odysseus v0.2 — Local Full-Stack MVP

[x] Browser extension analyzes pages
[x] Security headers retrieved
[x] Browser findings generated
[x] FastAPI receives analysis
[x] FastAPI validates requests
[x] FastAPI returns findings/risk
[x] Extension displays backend result
[ ] Git checkpoint

Next milestone

Odysseus v0.3 — Azure Deployment

The immediate progression is:

Local FastAPI
      ↓
Azure App Service
      ↓
HTTPS
      ↓
Azure-hosted API

Authentication with Microsoft Entra ID comes after the cloud deployment is working.

---

Documentation

Architecture details are maintained in:

docs/architecture.md

The architecture document should be updated whenever a significant system boundary or component changes.