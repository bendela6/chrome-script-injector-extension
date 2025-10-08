/**
 * Popup Script - Simplified for quick actions
 */

// ==================== INJECTED FUNCTION ====================
function injectScript(code) {
  try {
    const script = document.createElement('script');
    script.textContent = `(function() { ${code} })();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } catch (e) {
    console.error("Script Injector: Error executing script.", e);
  }
}

// ==================== DOM ELEMENTS ====================
const injectButton = document.getElementById("inject-btn");
const scriptTextArea = document.getElementById("script-area");
const manageScriptsBtn = document.getElementById("manage-scripts-btn");
const currentPageDiv = document.getElementById("current-page");
const currentUrlDiv = document.getElementById("current-url");
const totalScriptsEl = document.getElementById("total-scripts");
const matchedScriptsEl = document.getElementById("matched-scripts");

// ==================== MANUAL INJECTION ====================
injectButton.addEventListener('click', async () => {
  const scriptText = scriptTextArea.value;

  if (!scriptText.trim()) {
    alert('Please enter some JavaScript code to inject.');
    return;
  }

  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  if (tab?.id) {
    try {
      await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: injectScript,
        args: [scriptText],
        world: 'MAIN'
      });

      // Show success feedback
      const originalText = injectButton.textContent;
      injectButton.textContent = '✓ Injected Successfully!';
      injectButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      setTimeout(() => {
        injectButton.textContent = originalText;
        injectButton.style.background = '';
      }, 2000);
    } catch (error) {
      console.error("Script Injector: Error executing script.", error);
      alert('Failed to inject script. Check console for details.');
    }
  } else {
    alert("Could not find an active tab.");
  }
});

// ==================== OPEN MANAGEMENT PAGE ====================
manageScriptsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// ==================== LOAD STATS ====================
async function loadStats() {
  try {
    const result = await chrome.storage.sync.get(['scripts']);
    const scripts = result.scripts || [];

    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    // Update total scripts
    totalScriptsEl.textContent = scripts.length;

    // Show current URL
    if (tab?.url) {
      currentUrlDiv.textContent = tab.url;
      currentPageDiv.style.display = 'block';

      // Count matched scripts
      matchedScriptsEl.textContent = scripts.filter(script => {
        if (!script.urlPattern) return false;
        try {
          const regex = new RegExp(script.urlPattern);
          return regex.test(tab.url);
        } catch (e) {
          return false;
        }
      }).length;
    } else {
      matchedScriptsEl.textContent = 0;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
});
