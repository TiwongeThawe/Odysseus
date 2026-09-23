Absolutely. I’d make these two files the project documentation checkpoint for the current local MVP, while explicitly separating what exists now from the Azure roadmap.
docs/architecture.md
Writing
Odysseus Architecture
Project: Odysseus
Version: v0.2 — Local Full-Stack MVP
Status: Local browser extension + FastAPI backend working
Last Updated: 2026-09-23
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
2. Current Architecture
┌──────────────────────────────────────────┐
│             Chrome Browser               │
│                                          │
│  ┌────────────┐      ┌───────────────┐  │
│  │ popup.html │─────▶│   popup.js    │  │
│  └────────────┘      └───────┬───────┘  │
│                              │          │
│              ┌───────────────┘          │
│              ▼                          │
│       ┌──────────────┐                  │
│       │  content.js  │                  │
│       │              │                  │
│       │ Page / DOM   │                  │
│       │ analysis     │                  │
│       └──────────────┘                  │
│                                          │
│       ┌─────────────────────┐            │
│       │ service_worker.js   │            │
│       │                     │            │
│       │ Network / response  │            │
│       │ header information  │            │
│       └──────────┬──────────┘            │
└──────────────────┼───────────────────────┘
                   │
                   │ HTTP POST /analyze
                   ▼
          ┌───────────────────┐
          │   FastAPI Backend │
          │  localhost:8000   │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ Analysis Engine   │
          │                   │
          │ Validation        │
          │ Risk calculation  │
          │ Findings          │
          │ Summary           │
          └─────────┬─────────┘
                    │
                    │ JSON
                    ▼
          ┌───────────────────┐
          │   popup.js        │
          │                   │
          │ Backend result    │
          │ displayed to user │
          └───────────────────┘
3. Component Responsibilities
3.1 content.js
The content script is responsible for information that can be obtained from the webpage DOM.
Current observations include:
Page title
URL
Domain
Protocol
HTTPS status
Links
External links
Images
Forms
Scripts
External scripts
Iframes
External iframes
Videos
Buttons
Inputs
Form details
Iframe sources
URL parameters
URL hash
Referrer
Inline event handlers
contenteditable
DOM-oriented security indicators
innerHTML-related observations
Conceptually:
Webpage
   ↓
content.js
   ↓
DOM/page observations
The content script should primarily remain concerned with page-level information, rather than browser networking or backend communication.
3.2 service_worker.js
The service worker handles browser-level functionality that should not be performed directly by the content script.
One important responsibility is retrieving HTTP response headers.
Currently inspected headers include:
Content-Security-Policy
Strict-Transport-Security
X-Frame-Options
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Header names are normalized before being passed to the rest of the extension.
Conceptually:
HTTP response
      ↓
service_worker.js
      ↓
normalized headers
      ↓
popup.js
This separation prevents the DOM analysis layer from becoming responsible for browser/network-level operations.
3.3 popup.js
popup.js acts as the primary orchestration layer.
It:
Requests page information.
Receives information from the content script.
Requests browser/network information where required.
Combines observations.
Generates browser-side security findings.
Displays analysis results.
Sends structured analysis data to FastAPI.
Receives the backend response.
Displays the backend result.
Conceptually:
content.js
      │
      ▼
popup.js ◀──── service_worker.js
      │
      ├── local findings
      │
      ▼
FastAPI
      │
      ▼
backend findings
      │
      ▼
popup UI
4. Browser-Side Findings Engine
Odysseus currently converts raw observations into security findings.
Example findings include:
[MEDIUM] Content Security Policy missing
[MEDIUM] Referrer Policy missing
[MEDIUM] X-Content-Type-Options missing
[MEDIUM] Inline event handlers detected
[LOW]    External scripts detected
[MEDIUM] External iframes detected
Findings are aggregated by severity:
HIGH:   0
MEDIUM: 5
LOW:    1
INFO:   0
The findings engine is therefore already an application-level security analysis component rather than merely a page-information collector.
5. Backend Architecture
The local backend is implemented with FastAPI.
Current endpoint:
POST /analyze
Current flow:
Extension
    ↓
JSON request
    ↓
FastAPI
    ↓
Pydantic validation
    ↓
Security analysis
    ↓
Structured JSON response
Example conceptual response:
{
  "status": "received",
  "risk": "MEDIUM",
  "findings": [],
  "summary": {
    "high": 0,
    "medium": 5,
    "low": 1,
    "info": 0
  }
}
The backend has also been tested against invalid input, with FastAPI returning HTTP 422 for validation failures.
This establishes a genuine API boundary between the browser application and backend.
6. Current Data Flow
The complete local flow is:
7. User opens webpage

8. User opens Odysseus

9. popup.js requests page information

10. content.js analyzes the DOM

11. service_worker.js obtains browser/network-level
   information such as response headers

12. popup.js combines the observations

13. Browser-side findings are generated

14. popup.js creates the backend request

15. POST /analyze is sent to FastAPI

16. FastAPI validates the request

17. Backend analysis runs

18. Backend returns structured JSON

19. popup.js receives the response

20. Backend status/risk is displayed
The current architecture therefore represents:
Browser → Analysis → API → Analysis → Browser
15. Current Security Boundary
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
16. Current Project Structure
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
17. What Exists
Browser extension
Manifest V3 extension
Popup interface
Content script
Service worker
Extension messaging
Page inspection
DOM/security observations
Security header inspection
Browser-side findings
Severity aggregation
Backend
FastAPI application
REST endpoint
Pydantic request validation
Security analysis
Structured JSON response
Extension → API integration
Backend result displayed in extension
Not yet implemented
Azure deployment
Production HTTPS endpoint
Microsoft Entra ID
API authentication
API authorization/scopes
Cloud persistence
Cloud monitoring
Production secret management
CI/CD
Automated security scanning
Production hardening
18. Target Azure Architecture
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
19. Future Authentication Flow
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
OAuth 2.0
OpenID Connect
Access tokens
JWTs
Application registrations
API scopes
Authentication
Authorization
20. Future Persistence
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
21. Future Monitoring
The cloud application can eventually provide:
Extension
    ↓
FastAPI
    ↓
Application logs
    ↓
Azure monitoring
Potential telemetry includes:
API requests
HTTP errors
authentication failures
exceptions
response times
availability
unusual request patterns
Monitoring should support both application reliability and security visibility.
22. Future DevSecOps Pipeline
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
Automated tests
Dependency scanning
Secret detection
Static analysis
Container scanning, if containers are introduced
Deployment gates
Environment separation
23. Future Browser Security Research
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
24. Architectural Principles
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
17. Current Milestone
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