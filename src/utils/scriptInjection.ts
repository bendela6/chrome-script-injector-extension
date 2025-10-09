/**
 * Injects a JavaScript code snippet into the page context
 * @param code - The JavaScript code to inject
 */
export const injectScript = (code: string) => {
  try {
    const script = document.createElement('script');
    script.textContent = `(function() { ${code} })();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } catch (e) {
    console.error("Script Injector: Error executing script.", e);
  }
};

/**
 * Execute a script in a specific tab
 * @param tabId - The ID of the tab
 * @param code - The JavaScript code to inject
 */
export const executeScriptInTab = async (tabId: number, code: string) => {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: injectScript,
    args: [code],
    world: 'MAIN'
  });
};

