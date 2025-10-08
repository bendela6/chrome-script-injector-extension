/**
 * Background Service Worker
 * Automatically injects scripts when pages load and match URL patterns
 */

import { Script } from './types';

/**
 * Injected function to be executed in the context of the target page.
 * @param {string} code - The JavaScript code to inject.
 */
function injectScript(code: string) {
  try {
    const script = document.createElement('script');
    script.textContent = `(function() { ${code} })();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } catch (e) {
    console.error("Script Injector: Error executing script.", e);
  }
}

/**
 * Load all scripts from storage
 */
async function loadScripts(): Promise<Script[]> {
  const result = await chrome.storage.sync.get(['scripts']);
  return result.scripts || [];
}

/**
 * Check if a URL matches any script patterns and inject them
 */
async function checkAndInjectScripts(tabId: number, url: string) {
  if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
    return; // Skip chrome internal pages
  }

  const scripts = await loadScripts();

  // Filter scripts that match the current URL
  const matchingScripts = scripts.filter((script: Script) => {
    if (!script.urlPattern) return false; // Skip scripts without pattern

    try {
      const regex = new RegExp(script.urlPattern);
      return regex.test(url);
    } catch (e) {
      console.error(`Invalid regex for script "${script.name}":`, e);
      return false;
    }
  });

  // Inject all matching scripts
  for (const script of matchingScripts) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: injectScript,
        args: [script.code],
        world: 'MAIN'
      });
      console.log(`✅ Auto-injected script: "${script.name}" on ${url}`);
    } catch (error) {
      console.error(`Failed to inject script "${script.name}":`, error);
    }
  }
}

/**
 * Listen for tab updates (page loads)
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only inject when the page has finished loading
  if (changeInfo.status === 'complete' && tab.url) {
    checkAndInjectScripts(tabId, tab.url);
  }
});

/**
 * Listen for new tabs being created with URLs
 */
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url && tab.id) {
    checkAndInjectScripts(tab.id, tab.url);
  }
});

/**
 * Optional: Listen for storage changes to reload scripts in real-time
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.scripts) {
    console.log('Scripts updated in storage');
  }
});

console.log('🚀 Script Injector background service worker started');
