/**
 * Injected function to be executed in the context of the target page.
 * It executes the user's code directly in the page context.
 * @param {string} code - The JavaScript code to inject.
 */
function injectScript(code) {
  try {
    // Create a script element and inject it into the page
    // Using eval in the main world context bypasses extension CSP
    const script = document.createElement('script');
    script.textContent = `(function() { ${code} })();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } catch (e) {
    console.error("Script Injector: Error executing script.", e);
  }
}

// Get references to the DOM elements in the popup
const injectButton = document.getElementById("inject-btn");
const scriptTextArea = document.getElementById("script-area");

// Add a click event listener to the 'Inject Script' button
injectButton.addEventListener('click', async () => {
  const scriptText = scriptTextArea.value;

  // Do nothing if the script text is empty
  if (!scriptText.trim()) {
    return;
  }

  // Get the currently active tab
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  // Ensure we have a tab to inject into
  if (tab?.id) {
    // Use the Scripting API to execute our injectScript function
    // world: 'MAIN' makes it run in the page's context, not the extension's isolated world
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: injectScript,
      args: [scriptText],
      world: 'MAIN'
    });
  } else {
    console.error("Script Injector: Could not find an active tab.");
  }
});
