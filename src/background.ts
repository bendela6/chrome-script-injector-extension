import {
  executeScriptInTab,
  isScriptUrlMatched,
  scriptsStore,
  startScriptsStorageListener,
  startTabListener,
  tabStore,
} from "./utils";

(async () => {
  startTabListener();
  startScriptsStorageListener();

  tabStore.subscribe(() => checkAndInjectScripts());
  scriptsStore.subscribe(() => checkAndInjectScripts());

  async function checkAndInjectScripts() {
    const tab = tabStore.getData();
    const scripts = scriptsStore.getData();
    if (!tab || scripts.length === 0) {
      return;
    }

    for (const script of scripts) {
      if (!script.enabled || !isScriptUrlMatched(script, tab.url)) {
        continue;
      }
      try {
        await executeScriptInTab(tab.id, script.code);
        console.log(`✅ Auto-injected script: "${script.name}" on ${tab.url}`);
      } catch (error) {
        console.error(`Failed to inject script "${script.name}":`, error);
      }
    }
  }

  console.log("🚀 Script Injector background service worker started");
})();
