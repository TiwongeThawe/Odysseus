console.log("ODYSSEUS CONTENT SCRIPT LOADED");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	
	console.log("MESSAGE RECEIVED:", message);

	if (message.action === "analyzePage") {

		const currentUrl = new URL(window.location.href);
		
		//LINKS
		const links = document.querySelectorAll("a");
		const externalLinks = [];
		links.forEach((link) => {
			try {
				const linkUrl = new URL(link.href);
				if (
					linkUrl.hostname && linkUrl.hostname !== window.location.hostname
				) {
					externalLinks.push(link.href);
				}
			} catch (error) {
				console.log(
					"Could not process link:",
					link.href
				);
			}
		});

		//SCRIPTS

		const scripts = document.querySelectorAll("script");
		const externalScripts = [];
		scripts.forEach((script) => {
			if (!script.src) {
				return;
			}

			try {
				const scriptUrl = new URL(script.src, window.location.href);
				externalScripts.push({
					url: script.src,
					origin: scriptUrl.origin,
					external: scriptUrl.origin !== currentUrl.origin
				});
			} catch (error) {
				console.log(
					"Could not process script:",
					script.src
				);
			}
		});

		//Iframes
		const iframeElements = document.querySelectorAll("iframe");
		const iframeSource = [];
		iframeElements.forEach((iframe) => {
			if (!iframe.src) {
				return;
			}

			try {
				const iframeUrl = new URL(iframe.src, window.location.href);
				iframeSource.push({
					url: iframe.src,
					origin: iframeUrl.origin,
					external: iframeUrl.origin !== currentUrl.origin
				});
			} catch (error) {
				console.log(
					"Could not process iframe:",
					iframe.src
				);
			}
		});

		//FORMS
		const formElements = document.querySelectorAll("form");
		const forms = [];
		formElements.forEach((form) => {
			let action = form.action;
			let formUrl = null;

			try {
				formUrl = new URL(
					action || window.location.href
				);
			} catch (error) {
				console.log(
					"Could not process form:",
					action
				);
			}

			forms.push({
				action:
					formUrl
						? formUrl.href
						: action,
					method:
						(
							form.method ||
							"GET"
						).toUpperCase(),

					external:
						formUrl
							? formUrl.origin !==
							currentUrl.origin
							: false
			});
		});

		//Basic page info
		const pageInfo = {
			title: document.title,
			url: window.location.href,
			domain: currentUrl.hostname,
			protocol: currentUrl.protocol,

			//Element counts
			links: links.length,
			externalLinks: externalLinks,
			images: document.querySelectorAll("img").length,
			forms: formElements.length,
			formDetails: forms,
			scripts: scripts.length,
			externalScripts: externalScripts,
			iframes: iframeElements.length,
			iframeSource: iframeSource,
			videos: document.querySelectorAll("video").length,
			buttons: document.querySelectorAll("button").length,
			inputs: document.querySelectorAll("input").length,

			//Security related info
			https: currentUrl.protocol === "https:",
			urlParameters: currentUrl.search !== "",
			urlHash: currentUrl.hash !== "",
			referrer: document.referrer !== "",

			//Potentially interesting DOM features

			inlineEventHandlers: document.querySelectorAll(
				"[onclick], [onerror], [onload], [onmouseover]"
			).length,
			contentEditable: document.querySelectorAll(
				"[contenteditable='true']"
			).length
		};

		sendResponse(pageInfo);
	}
});