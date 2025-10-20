(async () => {
  const runAtArr = ["document_start", "document_end", "document_idle"] as const;

  runAtArr.map(async (runAt) => {
    await chrome.scripting.registerContentScripts([
      {
        id: `init-${runAt}`,
        matches: ["<all_urls>"],
        js: [`${runAt}.js`],
        runAt: runAt,
        world: "ISOLATED",
      },
    ]);
  });

  // Listen for messages from content scripts to execute code
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "EXECUTE_SCRIPT" && sender.tab?.id) {
      chrome.scripting
        .executeScript({
          target: { tabId: sender.tab.id },
          world: "MAIN",
          func: (code) => {
            try {
              eval(code);
            } catch (e) {
              console.error("Script execution error:", e);
            }
          },
          args: [message.code],
        })
        .catch((err) => console.error("Failed to execute script:", err));
    }
  });

  console.log("🚀 Script Injector background service worker started");
})();
