import { ScriptDto } from "./types";

const STORAGE_KEY = "scripts";

// Get all scripts from storage
async function getAllScripts(): Promise<ScriptDto[]> {
  const result = await chrome.storage.sync.get([STORAGE_KEY]);
  return result[STORAGE_KEY] || [];
}

// Check if URL matches the pattern
function isUrlMatched(urlPattern: string, url: string): boolean {
  const regexPattern = urlPattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(url);
}

// Inject matching scripts into a tab
async function injectScriptsIntoTab(tabId: number, url: string) {
  const scripts = await getAllScripts();
  const enabledScripts = scripts.filter((s) => s.enabled && isUrlMatched(s.urlPattern, url));

  for (const script of enabledScripts) {
    try {
      // Inject into MAIN world at the specified timing to bypass CSP
      await chrome.scripting.executeScript({
        target: { tabId },
        world: "MAIN",
        injectImmediately: script.runAt === "document_start",
        func: (code: string, scriptName: string) => {
          try {
            eval(code);
            console.log(`✓ Executed user script: ${scriptName}`);
          } catch (error) {
            console.error(`✗ Failed to execute user script: ${scriptName}`, error);
          }
        },
        args: [script.code, script.name],
      });
      console.log(`Injected script: ${script.name} into tab ${tabId}`);
    } catch (error) {
      console.error(`Failed to inject script: ${script.name}`, error);
    }
  }
}

// Listen for tab updates to inject scripts
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Inject when the document starts loading or when it's complete, depending on script timing
  if (changeInfo.status === "loading" && tab.url) {
    await injectScriptsIntoTab(tabId, tab.url);
  }
});

// Listen for new tabs or when tabs are activated
chrome.tabs.onCreated.addListener(async (tab) => {
  if (tab.id && tab.url) {
    await injectScriptsIntoTab(tab.id, tab.url);
  }
});

// Initialize on extension install/update
chrome.runtime.onInstalled.addListener(async () => {
  console.log("🚀 Script Injector extension installed/updated");

  // Inject scripts into all existing tabs
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id && tab.url) {
      await injectScriptsIntoTab(tab.id, tab.url);
    }
  }
});

// Initial startup
(async () => {
  console.log("🚀 Script Injector background service worker started");
})();
