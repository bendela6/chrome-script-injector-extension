function injectScript(code: string) {
  try {
    const script = document.createElement("script");
    script.textContent = `(function() { ${code} })();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } catch (e) {
    console.error("Script Injector: Error executing script.", e);
  }
}

export async function executeScriptInTab(tabId: number, code: string) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: injectScript,
    args: [code],
    world: "MAIN"
  });
}
