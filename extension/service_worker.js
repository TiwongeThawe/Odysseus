chrome.runtime.onMessage.addListener(
	(message, sender, sendResponse) => {

		if (message.action !== "getSecurityHeaders") {
			return;
		}

		const tabId = message.tabId;

		if (!tabId) {

			sendResponse({
				headers: null,
				error: "No tab ID supplied."
			});

			return;
		}


		chrome.tabs.get(
			tabId,

			async (tab) => {

				if (chrome.runtime.lastError) {

					sendResponse({
						headers: null,
						error:
							chrome.runtime.lastError.message
					});

					return;
				}


				if (!tab || !tab.url) {

					sendResponse({
						headers: null,
						error:
							"Could not determine tab URL."
					});

					return;
				}


				const url = tab.url;


				// Browser internal pages cannot be
				// analyzed using this fetch method.

				if (
					url.startsWith("chrome://") ||
					url.startsWith("chrome-extension://") ||
					url.startsWith("edge://") ||
					url.startsWith("about:")
				) {

					sendResponse({
						headers: null,
						error:
							"Security headers are unavailable for browser internal pages."
					});

					return;
				}


				try {

					const response =
						await fetch(
							url,
							{
								method: "GET",
								redirect: "follow",
								cache: "no-store"
							}
						);


					// Normalize ONCE here.
					//
					// From this point onward,
					// popup.js receives lowercase
					// header names.

					const headers = {};

					response.headers.forEach(
						(value, name) => {

							headers[
								name.toLowerCase()
							] = value;
						}
					);


					console.log(
						"Headers retrieved:",
						headers
					);


					sendResponse({
						headers: headers,
						status: response.status,
						url: response.url
					});

				} catch (error) {

					console.error(
						"Header fetch failed:",
						error
					);

					sendResponse({
						headers: null,
						error: error.message
					});
				}
			}
		);


		// Keep the message channel open
		// for the async fetch above.

		return true;
	}
);