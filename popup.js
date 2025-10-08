/**
 * Injected function to be executed in the context of the target page.
 * It creates a script tag, adds the user's code to it, and appends it to the document head.
 * @param {string} code - The JavaScript code to inject.
 */
function injectScript(code) {
  try {
    const script = document.createElement('script');
    script.textContent = code;
    (document.head || document.documentElement).appendChild(script);
    // Clean up by removing the script tag after it has been executed.
    script.remove();
  } catch (e) {
    console.error('Script Injector: Error injecting script.', e);
  }
}

/**
 * Adds a click event listener to the 'Inject Script' button.
 */
document.addEventListener('DOMContentLoaded', () => {
  const injectButton = document.getElementById('inject-btn');
  const scriptTextArea = document.getElementById('script-area');

  injectButton.addEventListener('click', async () => {
    const scriptText = scriptTextArea.value;

    // Do nothing if the script text is empty
    if (!scriptText.trim()) {
      return;
    }

    // Get the currently active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Ensure we have a tab to inject into
    if (tab?.id) {
      // Use the Scripting API to execute our injectScript function
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectScript,
        args: [scriptText],
      });
    } else {
      console.error("Script Injector: Could not find an active tab.");
    }
  });
});
