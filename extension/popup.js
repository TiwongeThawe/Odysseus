const button = document.getElementById("inspectButton");

const pageTitle = document.getElementById("pageTitle");
const pageUrl = document.getElementById("pageUrl");
const pageDomain = document.getElementById("pageDomain");
const pageProtocol = document.getElementById("pageProtocol");
const httpsStatus = document.getElementById("httpsStatus");

const linkCount = document.getElementById("linkCount");
const externalLinkCount = document.getElementById("externalLinkCount");
const imageCount = document.getElementById("imageCount");
const formCount = document.getElementById("formCount");
const scriptCount = document.getElementById("scriptCount");
const iframeCount = document.getElementById("iframeCount");
const videoCount = document.getElementById("videoCount");
const buttonCount = document.getElementById("buttonCount");
const inputCount = document.getElementById("inputCount");

// Resource analysis
const externalScriptCount =
	document.getElementById("externalScriptCount");

const externalFormCount =
	document.getElementById("externalFormCount");

const externalIframeCount =
	document.getElementById("externalIframeCount");

// DOM indicators
const urlParameters =
	document.getElementById("urlParameters");

const urlHash =
	document.getElementById("urlHash");

const referrer =
	document.getElementById("referrer");

const inlineHandlers =
	document.getElementById("inlineHandlers");

const contentEditable =
	document.getElementById("contentEditable");

// Security headers
const cspStatus =
	document.getElementById("cspStatus");

const hstsStatus =
	document.getElementById("hstsStatus");

const frameStatus =
	document.getElementById("frameStatus");

const contentTypeStatus =
	document.getElementById("contentTypeStatus");

const referrerPolicyStatus =
	document.getElementById("referrerPolicyStatus");

const permissionPolicyStatus =
	document.getElementById("permissionPolicyStatus");

// Findings / backend
const securityFindings =
	document.getElementById("securityFindings");

const securitySummary =
	document.getElementById("securitySummary");

const backendStatus =
	document.getElementById("backendStatus");

let currentPageData = null;
let currentHeaders = null;


// ============================================================
// DISPLAY FINDINGS
// ============================================================

function displayFindings(findings) {
	if (!securityFindings) {
		return;
	}

	securityFindings.innerHTML = "";

	findings.forEach((finding) => {
		const findingElement =
			document.createElement("div");

		findingElement.className = "finding";

		const title =
			document.createElement("strong");

		title.textContent =
			`[${finding.severity}] ${finding.title}`;

		const description =
			document.createElement("p");

		description.textContent =
			finding.description;

		findingElement.appendChild(title);
		findingElement.appendChild(description);

		securityFindings.appendChild(findingElement);
	});

	displaySummary(findings);
}


// ============================================================
// SECURITY SUMMARY
// ============================================================

function displaySummary(findings) {
	if (!securitySummary) {
		return;
	}

	const counts = {
		HIGH: 0,
		MEDIUM: 0,
		LOW: 0,
		INFO: 0
	};

	findings.forEach((finding) => {
		if (
			Object.prototype.hasOwnProperty.call(
				counts,
				finding.severity
			)
		) {
			counts[finding.severity]++;
		}
	});

	securitySummary.innerHTML = "";

	const heading =
		document.createElement("h3");

	heading.textContent = "Security Summary";

	const high =
		document.createElement("p");

	high.textContent =
		`HIGH: ${counts.HIGH}`;

	const medium =
		document.createElement("p");

	medium.textContent =
		`MEDIUM: ${counts.MEDIUM}`;

	const low =
		document.createElement("p");

	low.textContent =
		`LOW: ${counts.LOW}`;

	const info =
		document.createElement("p");

	info.textContent =
		`INFO: ${counts.INFO}`;

	securitySummary.appendChild(heading);
	securitySummary.appendChild(high);
	securitySummary.appendChild(medium);
	securitySummary.appendChild(low);
	securitySummary.appendChild(info);
}


// ============================================================
// DISPLAY PAGE DATA
// ============================================================

function displayPageData(response) {

	// Basic information

	pageTitle.textContent =
		response.title || "Unknown";

	pageUrl.textContent =
		response.url || "Unknown";

	pageDomain.textContent =
		response.domain || "Unknown";

	pageProtocol.textContent =
		response.protocol || "Unknown";

	httpsStatus.textContent =
		response.https
			? "Enabled"
			: "Not Enabled";


	// Elements

	linkCount.textContent =
		response.links || 0;

	externalLinkCount.textContent =
		Array.isArray(response.externalLinks)
			? response.externalLinks.length
			: 0;

	imageCount.textContent =
		response.images || 0;

	formCount.textContent =
		response.forms || 0;

	scriptCount.textContent =
		response.scripts || 0;

	iframeCount.textContent =
		response.iframes || 0;

	videoCount.textContent =
		response.videos || 0;

	buttonCount.textContent =
		response.buttons || 0;

	inputCount.textContent =
		response.inputs || 0;


	// Resource analysis

	externalIframeCount.textContent =
		Array.isArray(response.iframeSource)
			? response.iframeSource.filter(
				iframe => iframe.external
			).length
			: 0;

	externalScriptCount.textContent =
		Array.isArray(response.externalScripts)
			? response.externalScripts.filter(
				script => script.external
			).length
			: 0;

	externalFormCount.textContent =
		Array.isArray(response.formDetails)
			? response.formDetails.filter(
				form => form.external
			).length
			: 0;


	// DOM indicators

	urlParameters.textContent =
		response.urlParameters
			? "Detected"
			: "None";

	urlHash.textContent =
		response.urlHash
			? "Detected"
			: "None";

	referrer.textContent =
		response.referrer
			? "Present"
			: "None";

	inlineHandlers.textContent =
		response.inlineEventHandlers || 0;

	contentEditable.textContent =
		response.contentEditable || 0;
}


// ============================================================
// SEND ANALYSIS TO BACKEND
// ============================================================

async function sendToBackend(response) {

	if (backendStatus) {
		backendStatus.textContent =
			"Backend: Connecting...";
	}

	const backendPayload = {
		title: response.title || null,
		url: response.url || null,

		links: response.links || 0,
		images: response.images || 0,
		forms: response.forms || 0,
		scripts: response.scripts || 0,
		iframes: response.iframes || 0,
		videos: response.videos || 0,
		buttons: response.buttons || 0,
		inputs: response.inputs || 0,

		externalLinks:
			Array.isArray(response.externalLinks)
				? response.externalLinks.length
				: 0,

		externalScripts:
			Array.isArray(response.externalScripts)
				? response.externalScripts.filter(
					script => script.external
				).length
				: 0,

		externalIframes:
			Array.isArray(response.iframeSource)
				? response.iframeSource.filter(
					iframe => iframe.external
				).length
				: 0,

		urlParameters:
			Boolean(response.urlParameters),

		urlHash:
			Boolean(response.urlHash),

		referrer:
			Boolean(response.referrer),

		inlineHandlers:
			response.inlineEventHandlers || 0,

		contentEditable:
			response.contentEditable || 0
	};

	console.log(
		"Sending backend payload:",
		backendPayload
	);

	try {

		const apiResponse = await fetch(
			"http://127.0.0.1:8000/analyze",
			{
				method: "POST",

				headers: {
					"Content-Type": "application/json"
				},

				body:
					JSON.stringify(backendPayload)
			}
		);

		if (!apiResponse.ok) {
			const errorText =
				await apiResponse.text();

			throw new Error(
				`API returned ${apiResponse.status}: ${errorText}`
			);
		}

		const backendResult =
			await apiResponse.json();

		console.log(
			"Odysseus API response:",
			backendResult
		);

		console.log(
			"Backend Findings:",
			backendResult.findings
		);

		console.log(
			"Backend Summary:",
			backendResult.summary
		);

		if (backendStatus) {
			backendStatus.textContent =
				`Backend: ${backendResult.status} | Risk: ${backendResult.risk}`;
		}

		return backendResult;

	} catch (error) {

		console.error(
			"Could not connect to Odysseus API:",
			error
		);

		if (backendStatus) {
			backendStatus.textContent =
				`Backend: Offline (${error.message})`;
		}

		return null;
	}
}


// ============================================================
// GET SECURITY HEADERS
// ============================================================

function getSecurityHeaders(tabId) {

	chrome.runtime.sendMessage(
		{
			action: "getSecurityHeaders",
			tabId: tabId
		},

		(data) => {

			const error =
				chrome.runtime.lastError;

			if (error) {

				console.error(
					"Header error:",
					error.message
				);

				currentHeaders = null;

				displaySecurityHeaders(null);
				updateSecurityAnalysis();

				return;
			}

			if (!data || !data.headers) {

				console.warn(
					"No security headers returned."
				);

				currentHeaders = null;

				displaySecurityHeaders(null);
				updateSecurityAnalysis();

				return;
			}

			console.log(
				"Security headers:",
				data
			);

			// service_worker.js has already
			// converted header names to lowercase.
			currentHeaders = data.headers;

			displaySecurityHeaders(
				currentHeaders
			);

			updateSecurityAnalysis();
		}
	);
}


// ============================================================
// SECURITY RISK ANALYZER
// ============================================================

function analyzeSecurity(page, headers) {

	const findings = [];


	// HTTPS

	if (!page.https) {

		findings.push({
			severity: "HIGH",
			title: "HTTPS is not enabled",
			description:
				"The page is being accessed without HTTPS."
		});
	}


	// Only evaluate HTTP security headers
	// when header retrieval actually succeeded.

	if (headers) {

		if (!headers["content-security-policy"]) {

			findings.push({
				severity: "MEDIUM",
				title: "Content Security Policy missing",
				description:
					"The page does not appear to provide a Content-Security-Policy header."
			});
		}


		if (!headers["x-frame-options"]) {

			findings.push({
				severity: "MEDIUM",
				title: "X-Frame-Options missing",
				description:
					"The page does not appear to provide an X-Frame-Options header."
			});
		}


		if (!headers["referrer-policy"]) {

			findings.push({
				severity: "MEDIUM",
				title: "Referrer Policy missing",
				description:
					"The page does not appear to provide a Referrer-Policy header."
			});
		}


		if (!headers["permissions-policy"]) {

			findings.push({
				severity: "MEDIUM",
				title: "Permissions Policy missing",
				description:
					"The page does not appear to provide a Permissions-Policy header."
			});
		}


		if (!headers["x-content-type-options"]) {

			findings.push({
				severity: "MEDIUM",
				title: "X-Content-Type-Options missing",
				description:
					"The page does not appear to provide an X-Content-Type-Options header."
			});
		}

	}


	// Inline handlers

	if (page.inlineEventHandlers > 0) {

		findings.push({
			severity: "MEDIUM",
			title: "Inline event handlers detected",
			description:
				`${page.inlineEventHandlers} inline event handler(s) were detected.`
		});
	}


	// External scripts

	if (
		Array.isArray(page.externalScripts) &&
		page.externalScripts.length > 0
	) {

		findings.push({
			severity: "LOW",
			title: "External scripts detected",
			description:
				`${page.externalScripts.length} external script(s) were detected.`
		});
	}


	// External iframes

	if (
		Array.isArray(page.iframeSource) &&
		page.iframeSource.length > 0
	) {

		const externalIframes =
			page.iframeSource.filter(
				iframe => iframe.external
			);

		if (externalIframes.length > 0) {

			findings.push({
				severity: "MEDIUM",
				title: "External iframes detected",
				description:
					`${externalIframes.length} external iframe(s) were detected.`
			});
		}
	}


	// URL parameters

	if (page.urlParameters) {

		findings.push({
			severity: "INFO",
			title: "URL parameters detected",
			description:
				"The current URL contains query parameters."
		});
	}


	// URL hash

	if (page.urlHash) {

		findings.push({
			severity: "INFO",
			title: "URL fragment detected",
			description:
				"The current URL contains a fragment/hash."
		});
	}


	if (findings.length === 0) {

		findings.push({
			severity: "INFO",
			title: "No obvious indicators detected",
			description:
				"Odysseus did not identify any of its configured indicators."
		});
	}

	return findings;
}


// ============================================================
// DISPLAY SECURITY HEADERS
// ============================================================
//
// IMPORTANT:
// service_worker.js already lowercases every header name.
// Therefore DO NOT normalize them again here.
//

function displayHeaderStatus(
	element,
	headers,
	name
) {

	if (!element) {
		return;
	}

	if (!headers) {

		element.textContent =
			"Unavailable";

		return;
	}

	element.textContent =
		Object.prototype.hasOwnProperty.call(
			headers,
			name
		)
			? "Present"
			: "Missing";
}


function displaySecurityHeaders(headers) {

	displayHeaderStatus(
		cspStatus,
		headers,
		"content-security-policy"
	);

	displayHeaderStatus(
		hstsStatus,
		headers,
		"strict-transport-security"
	);

	displayHeaderStatus(
		frameStatus,
		headers,
		"x-frame-options"
	);

	displayHeaderStatus(
		contentTypeStatus,
		headers,
		"x-content-type-options"
	);

	displayHeaderStatus(
		referrerPolicyStatus,
		headers,
		"referrer-policy"
	);

	displayHeaderStatus(
		permissionPolicyStatus,
		headers,
		"permissions-policy"
	);
}


// ============================================================
// ORCHESTRATION
// ============================================================

function updateSecurityAnalysis() {

	if (!currentPageData) {
		return;
	}

	// IMPORTANT:
	// Use currentHeaders.
	// There is no variable called "headers" here.

	const findings =
		analyzeSecurity(
			currentPageData,
			currentHeaders
		);

	displayFindings(findings);
}


// ============================================================
// BUTTON
// ============================================================

button.addEventListener(
	"click",
	async () => {

		button.disabled = true;
		button.textContent = "Analyzing...";

		// Reset previous data

		currentPageData = null;
		currentHeaders = null;


		// Reset header display

		cspStatus.textContent =
			"Checking...";

		hstsStatus.textContent =
			"Checking...";

		frameStatus.textContent =
			"Checking...";

		contentTypeStatus.textContent =
			"Checking...";

		referrerPolicyStatus.textContent =
			"Checking...";

		permissionPolicyStatus.textContent =
			"Checking...";


		try {

			// Get current tab

			const [tab] =
				await chrome.tabs.query({
					active: true,
					currentWindow: true
				});

			if (!tab || !tab.id) {

				throw new Error(
					"Could not determine current tab."
				);
			}


			// Ask content.js for page analysis

			chrome.tabs.sendMessage(
				tab.id,

				{
					action: "analyzePage"
				},

				async (response) => {

					const error =
						chrome.runtime.lastError;

					if (error) {

						console.error(
							"Content script error:",
							error.message
						);

						securityFindings.innerHTML =
							`<p>Could not analyze this page: ${error.message}</p>`;

						button.textContent =
							"Analyze Current Page";

						button.disabled = false;

						return;
					}


					if (!response) {

						securityFindings.innerHTML =
							"<p>No page response received.</p>";

						button.textContent =
							"Analyze Current Page";

						button.disabled = false;

						return;
					}


					console.log(
						"Page response:",
						response
					);

					currentPageData =
						response;

					displayPageData(
						response
					);

					updateSecurityAnalysis();


					// Backend

					await sendToBackend(
						response
					);


					button.textContent =
						"Analyze Current Page";

					button.disabled = false;
				}
			);


			// Security headers are retrieved
			// separately by the service worker.

			getSecurityHeaders(
				tab.id
			);

		} catch (error) {

			console.error(
				"Odysseus error:",
				error
			);

			securityFindings.innerHTML =
				`<p>Error: ${error.message}</p>`;

			button.disabled = false;

			button.textContent =
				"Analyze Current Page";
		}
	}
);