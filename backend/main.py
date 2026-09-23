import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional


# Config
API_VERSION = os.getenv("API_VERSION", "0.3.0")
API_NAME = os.getenv("API_NAME", "Odysseus API")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

# Fastapi app

app = FastAPI(

	title=API_NAME,
	description="Back end API for Odysseus Browser security navigator",
	version=API_VERSION
)

app.add_middleware(
	CORSMiddleware,
	allow_origins=ALLOWED_ORIGINS,
	allow_credentials=False,
	allow_methods=["GET", "POST"],
	allow_headers=["Content-Type"],
)

class PageAnalysis(BaseModel):
	title: Optional[str] = Field(
		default=None,
		max_length=500
	)
	#Element counts
	url: Optional[HttpUrl] = None
	links: int = Field(default=0, ge=0)
	images: int = Field(default=0, ge=0)
	forms: int = Field(default=0, ge=0)
	scripts: int = Field(default=0, ge=0)
	iframes: int = Field(default=0, ge=0)
	videos: int = Field(default=0, ge=0)
	buttons: int = Field(default=0, ge=0)
	inputs: int = Field(default=0, ge=0)
	#Externals
	externalLinks: int = Field(default=0, ge=0)
	externalScripts: int = Field(default=0, ge=0)
	externalIframes: int = Field(default=0, ge=0)

	urlParameters: bool = False
	urlHash: bool = False
	referrer: bool = False

	inlineHandlers: int = Field(default=0, ge=0)
	contentEditable: int = Field(default=0, ge=0)

def analyze_security(data: PageAnalysis) -> dict:
	"""
	Performs backend-side security analysis.

	This is intentionally simple for the current Odysseus learning stage.

	"""
	findings = []

	#Https
	if data.url and data.url.scheme != "https":
		findings.append({
			"severity": "HIGH",
			"title": "HTTPS is not enabled",
			"description": "The analyzed page is not using https."
		})

	#Inline events
	if data.inlineHandlers > 0:
		findings.append({
			"severity": "MEDIUM",
			"title": "Inline event handlers detected",
			"description": (f"{data.inlineHandlers} inline event handler(s) were detected.")
		})
	#External scripts
	if data.externalScripts > 0:
		findings.append({
			"severity": "MEDIUM",
			"title": "External scripts detected",
			"description": (f"{data.externalScripts} external script(s) were detected.")
		})
	#External iframes
	if data.externalIframes > 0:
		findings.append({
			"severity": "MEDIUM",
			"title": "External iframes detected",
			"description": (f"{data.externalIframes} external iframe(s) were detected.")
		})
	#URL Parameters
	if data.urlParameters > 0:
		findings.append({
			"severity": "INFO",
			"title": "Url Parameters detected",
			"description": ("The current URL contains query parameters.")
		})
	#URL Hash
	if data.urlHash:
		findings.append({
			"severity": "INFO",
			"title": "URL fragment detected",
			"description": ("The current URL contains a fragment/hash.")
		})
	#Conteditable
	if data.contentEditable > 0:
		findings.append({
			"severity": "INFO",
			"title": "Contenteditable elements detected",
			"description": (f"{data.contentEditable} content editable element(s) were detected.")
		})
	#default finding
	if not findings:
		findings.append({
			"severity": "INFO",
			"title": "No configured indicators detected",
			"description": ("Odysseus did not identifyany of it's currently configured backend indicators.")
		})
	# calculate summary
	summary = {
		"HIGH": 0,
		"MEDIUM": 0,
		"LOW": 0,
		"INFO": 0
	}

	for finding in findings:
		severity = finding["severity"]

		if severity in summary:
			summary[severity] += 1

	#Overall risk

	if summary["HIGH"] > 0:
		risk = "HIGH"
	elif summary["MEDIUM"] > 0:
		risk = "MEDIUM"
	elif summary["LOW"] > 0:
		risk = "LOW"
	else:
		risk = "INFO"

	return {
		"risk": risk,
		"findings": findings,
		"summary": summary
	}

#ERROR HANDLE
@app.exception_handler(Exception)
async def general_exception_handler(
	request: Request,
	exc: Exception
):
	print(
		f"Unhanded error on {request.method} "
		f"{request.url}: {exc}"
	)

	return JSONResponse(
		status_code=500,
		content={
			"status": "error",
			"message": "flipping internal server error."
		}
	)

@app.get("/")
def home():
	return {
		"name": "Odysseus",
		"message": "Browser Security Navigator API",
		"status": "online",
		"version": API_VERSION
	}

@app.get("/health")
def health():
	return {
		"status": "healthy",
		"service": "odysseus-api",
		"version": API_VERSION
	}

@app.post("/analyze")
def analyze_page(data: PageAnalysis):
	
	result = analyze_security(data)

	return {
		"status": "received",
		"page": str(data.url) if data.url else None,
		"title": data.title,
		"risk": result["risk"],
		"summary": result["summary"],
		"findings": result["findings"],
		"message": "Page analysis successfully received by Odysseus API"
	}
