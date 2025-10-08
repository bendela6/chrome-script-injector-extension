/**
 * Options Page Script - Full page for managing scripts
 */

// ==================== STATE MANAGEMENT ====================
let scripts = [];
let editingScriptId = null;
let currentUrl = '';

// ==================== DOM ELEMENTS ====================
const newScriptBtn = document.getElementById("new-script-btn");
const scriptModal = document.getElementById("script-modal");
const saveScriptBtn = document.getElementById("save-script-btn");
const cancelScriptBtn = document.getElementById("cancel-script-btn");
const scriptsGrid = document.getElementById("scripts-grid");
const currentUrlBanner = document.getElementById("current-url-banner");
const modalTitle = document.getElementById("modal-title");
const searchInput = document.getElementById("search-input");

// Stats
const totalScriptsEl = document.getElementById("total-scripts");
const autoInjectScriptsEl = document.getElementById("auto-inject-scripts");
const matchedScriptsEl = document.getElementById("matched-scripts");

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

// ==================== CURRENT URL ====================
async function getCurrentUrl() {
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (tab?.url) {
      currentUrl = tab.url;
      currentUrlBanner.textContent = `📍 Current Page: ${currentUrl}`;
      currentUrlBanner.style.display = 'block';
    }
  } catch (e) {
    // No active tab or permission issue
    currentUrl = '';
  }
}

// ==================== STATS ====================
function updateStats() {
  const total = scripts.length;
  const autoInject = scripts.filter(s => s.urlPattern).length;
  const matched = scripts.filter(script => {
    if (!currentUrl || !script.urlPattern) return false;
    try {
      const regex = new RegExp(script.urlPattern);
      return regex.test(currentUrl);
    } catch (e) {
      return false;
    }
  }).length;

  totalScriptsEl.textContent = total;
  autoInjectScriptsEl.textContent = autoInject;
  matchedScriptsEl.textContent = matched;
}

// ==================== SEARCH ====================
let searchQuery = '';

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.toLowerCase();
  renderScripts();
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
  scriptNameInput.focus();
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
      alert('Invalid regex pattern for URL. Please check your pattern.');
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
        code,
        updatedAt: new Date().toISOString()
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
  await loadAndRenderScripts();
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

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && scriptModal.classList.contains('active')) {
    scriptModal.classList.remove('active');
  }
});

// READ & DISPLAY
async function loadAndRenderScripts() {
  await loadScripts();
  await getCurrentUrl();
  renderScripts();
  updateStats();
}

function renderScripts() {
  // Filter scripts based on search query
  let filteredScripts = scripts;
  if (searchQuery) {
    filteredScripts = scripts.filter(script =>
      script.name.toLowerCase().includes(searchQuery) ||
      (script.urlPattern && script.urlPattern.toLowerCase().includes(searchQuery))
    );
  }

  if (filteredScripts.length === 0) {
    if (searchQuery) {
      scriptsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h2>No Scripts Found</h2>
          <p>No scripts match "${escapeHtml(searchQuery)}"</p>
        </div>
      `;
    } else {
      scriptsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h2>No Scripts Yet</h2>
          <p>Create your first script to get started with automatic injection</p>
          <button class="btn btn-primary" onclick="document.getElementById('new-script-btn').click()">
            ➕ Create First Script
          </button>
        </div>
      `;
    }
    return;
  }

  scriptsGrid.innerHTML = filteredScripts.map(script => {
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

    const codePreview = script.code.length > 150
      ? script.code.substring(0, 150) + '...'
      : script.code;

    return `
      <div class="script-card ${isMatched ? 'matched' : ''}" data-id="${script.id}">
        <div class="script-card-header">
          <div>
            <div class="script-title">${escapeHtml(script.name)}</div>
          </div>
          ${isMatched ? '<span class="match-badge">✓ AUTO-INJECTED</span>' : ''}
        </div>
        
        <div class="script-url ${script.urlPattern ? '' : 'empty'}">
          ${script.urlPattern ? escapeHtml(script.urlPattern) : 'No URL pattern (manual only)'}
        </div>
        
        <div class="script-code-preview">${escapeHtml(codePreview)}</div>
        
        <div class="script-actions">
          <button class="btn btn-small btn-run" data-action="run" data-id="${script.id}">
            ▶ Run
          </button>
          <button class="btn btn-small btn-edit" data-action="edit" data-id="${script.id}">
            ✏ Edit
          </button>
          <button class="btn btn-small btn-delete" data-action="delete" data-id="${script.id}">
            🗑 Delete
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach event listeners
  scriptsGrid.querySelectorAll('button[data-action]').forEach(btn => {
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
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    if (tab?.id) {
      await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: injectScript,
        args: [script.code],
        world: 'MAIN'
      });

      // Show success feedback
      const btn = document.querySelector(`button[data-action="run"][data-id="${script.id}"]`);
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✓ Injected!';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 2000);
      }
    } else {
      alert('No active tab found. Please open a web page first.');
    }
  } catch (error) {
    console.error('Failed to inject script:', error);
    alert('Failed to inject script. Check the console for details.');
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
  scriptNameInput.focus();
}

// DELETE script
async function deleteScript(scriptId) {
  const script = scripts.find(s => s.id === scriptId);
  if (confirm(`Are you sure you want to delete "${script.name}"?`)) {
    scripts = scripts.filter(s => s.id !== scriptId);
    await saveScripts();
    await loadAndRenderScripts();
  }
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Injected function to be executed in the context of the target page.
 */
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

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  loadAndRenderScripts();
});

// Listen for storage changes from other pages
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.scripts) {
    loadAndRenderScripts();
  }
});

