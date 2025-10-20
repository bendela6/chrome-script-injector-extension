import { isScriptUrlMatched, scriptsStore, startScriptsStorageListener } from "./utils";
import { ScriptDto, ScriptRunAt } from "./types.ts";

function injectScript(code: string) {
  chrome.scripting
    .executeScript({
      target: { tabId: chrome.devtools?.inspectedWindow?.tabId as number },
      world: "MAIN",
      func: (code) => {
        try {
          eval(code);
        } catch (e) {
          console.error("Script execution error:", e);
        }
      },
      args: [code],
    })
    .catch(() => {
      // Fallback: inject via DOM (works if CSP allows)
      const script = document.createElement("script");
      script.textContent = code;
      (document.head || document.documentElement).appendChild(script);
      script.remove();
    });
}

export async function registerContentScripts(runAt: ScriptRunAt) {
  await startScriptsStorageListener();
  scriptsStore.subscribe((scripts) => {
    scripts
      .filter((script) => script.enabled)
      .filter((script) => script.runAt === runAt)
      .filter((script: ScriptDto) => isScriptUrlMatched(script, window.location.href))
      .forEach((script: ScriptDto) => {
        console.log(`Script matched: ${script.name} for URL: ${window.location.href}`);
        injectScript(script.code);
      });
  });
}
