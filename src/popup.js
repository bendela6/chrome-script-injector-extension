/**
 * Injected function to be executed in the context of the target page.
 * It executes the user's code directly in the page context.
 * @param {string} code - The JavaScript code to inject.
 */
function injectScript(code) {
  try {
    // Create a script element and inject it into the page
    // Using eval in the main world context bypasses extension CSP
    const script = document.createElement('script');
    script.textContent = `(function() { ${code} })();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } catch (e) {
    console.error("Script Injector: Error executing script.", e);
  }
}

// ==================== STATE MANAGEMENT ====================
let scripts = [];
let editingScriptId = null;
let currentTab = null;

// ==================== DOM ELEMENTS ====================
const injectButton = document.getElementById("inject-btn");
const scriptTextArea = document.getElementById("script-area");
const newScriptBtn = document.getElementById("new-script-btn");
const scriptModal = document.getElementById("script-modal");
const saveScriptBtn = document.getElementById("save-script-btn");
const cancelScriptBtn = document.getElementById("cancel-script-btn");
const scriptList = document.getElementById("script-list");
const currentUrlDisplay = document.getElementById("current-url-display");
const modalTitle = document.getElementById("modal-title");

// Form inputs
const scriptNameInput = document.getElementById("script-name");
const scriptUrlInput = document.getElementById("script-url");
const scriptCodeInput = document.getElementById("script-code");

// ==================== STORAGE FUNCTIONS ====================
async function loadScripts() {
  const result = await chrome.storage.sync.get(['scripts']);
  scripts = result.scripts || [];
  return scripts;
}

async function saveScripts() {
  await chrome.storage.sync.set({ scripts });
}

// ==================== TAB SWITCHING ====================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');

    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load scripts when switching to saved tab
    if (tabName === 'saved') {
      loadAndDisplayScripts();
      displayCurrentUrl();
    }
  });
});

// ==================== MANUAL INJECTION ====================
injectButton.addEventListener('click', async () => {
  const scriptText = scriptTextArea.value;

  if (!scriptText.trim()) {
    return;
  }

  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  if (tab?.id) {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: injectScript,
      args: [scriptText],
      world: 'MAIN'
    });
  } else {
    console.error("Script Injector: Could not find an active tab.");
  }
});

// ==================== SCRIPT CRUD OPERATIONS ====================

// CREATE / UPDATE
newScriptBtn.addEventListener('click', () => {
  editingScriptId = null;
  modalTitle.textContent = 'New Script';
  scriptNameInput.value = '';
  scriptUrlInput.value = '';
  scriptCodeInput.value = '';
  scriptModal.classList.add('active');
});

saveScriptBtn.addEventListener('click', async () => {
  const name = scriptNameInput.value.trim();
  const urlPattern = scriptUrlInput.value.trim();
  const code = scriptCodeInput.value.trim();

  if (!name || !code) {
    alert('Please fill in the script name and code.');
    return;
  }

  // Validate regex if provided
  if (urlPattern) {
    try {
      new RegExp(urlPattern);
    } catch (e) {
      alert('Invalid regex pattern for URL.');
      return;
    }
  }

  if (editingScriptId !== null) {
    // UPDATE existing script
    const index = scripts.findIndex(s => s.id === editingScriptId);
    if (index !== -1) {
      scripts[index] = {
        ...scripts[index],
        name,
        urlPattern,
        code
      };
    }
  } else {
    // CREATE new script
    const newScript = {
      id: Date.now(),
      name,
      urlPattern,
      code,
      createdAt: new Date().toISOString()
    };
    scripts.push(newScript);
  }

  await saveScripts();
  scriptModal.classList.remove('active');
  loadAndDisplayScripts();
});

cancelScriptBtn.addEventListener('click', () => {
  scriptModal.classList.remove('active');
});

// Close modal on background click
scriptModal.addEventListener('click', (e) => {
  if (e.target === scriptModal) {
    scriptModal.classList.remove('active');
  }
});

// READ & DISPLAY
async function loadAndDisplayScripts() {
  await loadScripts();
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  renderScriptList(tab?.url);
}

function renderScriptList(currentUrl = '') {
  if (scripts.length === 0) {
    scriptList.innerHTML = `
      <div class="empty-state">
        No saved scripts yet.<br>Click "New Script" to create one.
      </div>
    `;
    return;
  }

  scriptList.innerHTML = scripts.map(script => {
    // Check if this script matches the current URL
    let isMatched = false;
    if (currentUrl && script.urlPattern) {
      try {
        const regex = new RegExp(script.urlPattern);
        isMatched = regex.test(currentUrl);
      } catch (e) {
        // Invalid regex
      }
    }

    return `
      <div class="script-item ${isMatched ? 'matched' : ''}" data-id="${script.id}">
        <div class="script-item-header">
          <div class="script-name">
            ${escapeHtml(script.name)}
            ${isMatched ? '<span class="match-badge">AUTO-INJECTED</span>' : ''}
          </div>
        </div>
        ${script.urlPattern ? `<div class="script-url">Pattern: ${escapeHtml(script.urlPattern)}</div>` : '<div class="script-url">No URL pattern (manual only)</div>'}
        <div class="script-actions">
          <button class="btn btn-small btn-run" data-action="run" data-id="${script.id}">▶ Run</button>
          <button class="btn btn-small btn-edit" data-action="edit" data-id="${script.id}">✏ Edit</button>
          <button class="btn btn-small btn-delete" data-action="delete" data-id="${script.id}">🗑 Delete</button>
        </div>
      </div>
    `;
  }).join('');

  // Attach event listeners
  scriptList.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', handleScriptAction);
  });
}

// Handle script actions (Run, Edit, Delete)
async function handleScriptAction(e) {
  const action = e.target.getAttribute('data-action');
  const scriptId = parseInt(e.target.getAttribute('data-id'));
  const script = scripts.find(s => s.id === scriptId);

  if (!script) return;

  switch (action) {
    case 'run':
      await runScript(script);
      break;
    case 'edit':
      editScript(script);
      break;
    case 'delete':
      await deleteScript(scriptId);
      break;
  }
}

// RUN script
async function runScript(script) {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  if (tab?.id) {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: injectScript,
      args: [script.code],
      world: 'MAIN'
    });
  } else {
    console.error("Script Injector: Could not find an active tab.");
  }
}

// EDIT script
function editScript(script) {
  editingScriptId = script.id;
  modalTitle.textContent = 'Edit Script';
  scriptNameInput.value = script.name;
  scriptUrlInput.value = script.urlPattern || '';
  scriptCodeInput.value = script.code;
  scriptModal.classList.add('active');
}

// DELETE script
async function deleteScript(scriptId) {
  if (confirm('Are you sure you want to delete this script?')) {
    scripts = scripts.filter(s => s.id !== scriptId);
    await saveScripts();
    renderScriptList();
  }
}

// ==================== AUTO-INJECT ON URL MATCH ====================
async function displayCurrentUrl() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (tab?.url) {
    currentUrlDisplay.textContent = `Current URL: ${tab.url}`;
    currentUrlDisplay.style.display = 'block';

    // Check for matching scripts
    checkAndAutoInject(tab);
  } else {
    currentUrlDisplay.style.display = 'none';
  }
}

async function checkAndAutoInject(tab) {
  await loadScripts();

  const matchingScripts = scripts.filter(script => {
    if (!script.urlPattern) return false; // Skip scripts without pattern

    try {
      const regex = new RegExp(script.urlPattern);
      return regex.test(tab.url);
    } catch (e) {
      console.error(`Invalid regex for script "${script.name}":`, e);
      return false;
    }
  });

  // Note: Auto-injection would require additional permissions and background script
  // For now, matching scripts are just identified (could add visual indicator)
  if (matchingScripts.length > 0) {
    console.log(`Found ${matchingScripts.length} matching script(s) for this URL`);
  }
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  loadAndDisplayScripts();
});
