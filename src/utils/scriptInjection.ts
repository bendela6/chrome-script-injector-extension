import { ScriptDto } from "../types.ts";

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

export async function executeScriptInTab(tabId: number, script: ScriptDto) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: injectScript,
    args: [script.code],
    world: "MAIN",
  });
}
