import React, { useState, useEffect } from 'react';
import { Script } from './types';
import './Options.css';

const injectScript = (code: string) => {
  try {
    const script = document.createElement('script');
    script.textContent = `(function() { ${code} })();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  } catch (e) {
    console.error("Script Injector: Error executing script.", e);
  }
};

const Options: React.FC = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [editingScriptId, setEditingScriptId] = useState<number | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    urlPattern: '',
    code: ''
  });

  useEffect(() => {
    loadAndRenderScripts();
  }, []);

  const loadAndRenderScripts = async () => {
    await loadScripts();
    await getCurrentUrl();
  };

  const loadScripts = async () => {
    const result = await chrome.storage.sync.get(['scripts']);
    setScripts(result.scripts || []);
  };

  const saveScripts = async (newScripts: Script[]) => {
    await chrome.storage.sync.set({ scripts: newScripts });
    setScripts(newScripts);
  };

  const getCurrentUrl = async () => {
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      if (tab?.url) {
        setCurrentUrl(tab.url);
      }
    } catch (e) {
      setCurrentUrl('');
    }
  };

  const filteredScripts = scripts.filter(script =>
    !searchQuery ||
    script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (script.urlPattern && script.urlPattern.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStats = () => {
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
    return { total, autoInject, matched };
  };

  const stats = getStats();

  const isScriptMatched = (script: Script): boolean => {
    if (!currentUrl || !script.urlPattern) return false;
    try {
      const regex = new RegExp(script.urlPattern);
      return regex.test(currentUrl);
    } catch (e) {
      return false;
    }
  };

  const handleNewScript = () => {
    setEditingScriptId(null);
    setFormData({ name: '', urlPattern: '', code: '' });
    setShowModal(true);
  };

  const handleEditScript = (script: Script) => {
    setEditingScriptId(script.id);
    setFormData({
      name: script.name,
      urlPattern: script.urlPattern || '',
      code: script.code
    });
    setShowModal(true);
  };

  const handleSaveScript = async () => {
    const { name, urlPattern, code } = formData;

    if (!name.trim() || !code.trim()) {
      alert('Please fill in the script name and code.');
      return;
    }

    if (urlPattern) {
      try {
        new RegExp(urlPattern);
      } catch (e) {
        alert('Invalid regex pattern for URL. Please check your pattern.');
        return;
      }
    }

    let newScripts: Script[];

    if (editingScriptId !== null) {
      newScripts = scripts.map(s =>
        s.id === editingScriptId
          ? { ...s, name, urlPattern, code, updatedAt: new Date().toISOString() }
          : s
      );
    } else {
      const newScript: Script = {
        id: Date.now(),
        name,
        urlPattern,
        code,
        createdAt: new Date().toISOString()
      };
      newScripts = [...scripts, newScript];
    }

    await saveScripts(newScripts);
    setShowModal(false);
  };

  const handleDeleteScript = async (scriptId: number) => {
    const script = scripts.find(s => s.id === scriptId);
    if (confirm(`Are you sure you want to delete "${script?.name}"?`)) {
      const newScripts = scripts.filter(s => s.id !== scriptId);
      await saveScripts(newScripts);
    }
  };

  const handleRunScript = async (script: Script) => {
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      if (tab?.id) {
        await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: injectScript,
          args: [script.code],
          world: 'MAIN'
        });
      } else {
        alert('No active tab found. Please open a web page first.');
      }
    } catch (error) {
      console.error('Failed to inject script:', error);
      alert('Failed to inject script. Check the console for details.');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🚀 Script Injector - Manage Scripts</h1>
        <p>Create and manage your JavaScript injection scripts with automatic URL matching</p>
      </div>

      {currentUrl && (
        <div className="current-url-banner">
          📍 Current Page: {currentUrl}
        </div>
      )}

      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Scripts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.autoInject}</div>
          <div className="stat-label">Auto-Inject Scripts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.matched}</div>
          <div className="stat-label">Active on Current Page</div>
        </div>
      </div>

      <div className="actions-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scripts by name or URL pattern..."
          />
        </div>
        <button onClick={handleNewScript} className="btn btn-primary">
          ➕ New Script
        </button>
      </div>

      <div className="scripts-grid">
        {filteredScripts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h2>{searchQuery ? 'No Scripts Found' : 'No Scripts Yet'}</h2>
            <p>{searchQuery ? `No scripts match "${searchQuery}"` : 'Create your first script to get started with automatic injection'}</p>
            {!searchQuery && (
              <button className="btn btn-primary" onClick={handleNewScript}>
                ➕ Create First Script
              </button>
            )}
          </div>
        ) : (
          filteredScripts.map(script => {
            const isMatched = isScriptMatched(script);
            const codePreview = script.code.length > 150
              ? script.code.substring(0, 150) + '...'
              : script.code;

            return (
              <div key={script.id} className={`script-card ${isMatched ? 'matched' : ''}`}>
                <div className="script-card-header">
                  <div className="script-title">{script.name}</div>
                  {isMatched && <span className="match-badge">✓ AUTO-INJECTED</span>}
                </div>

                <div className={`script-url ${script.urlPattern ? '' : 'empty'}`}>
                  {script.urlPattern || 'No URL pattern (manual only)'}
                </div>

                <div className="script-code-preview">{codePreview}</div>

                <div className="script-actions">
                  <button
                    className="btn btn-small btn-run"
                    onClick={() => handleRunScript(script)}
                  >
                    ▶ Run
                  </button>
                  <button
                    className="btn btn-small btn-edit"
                    onClick={() => handleEditScript(script)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="btn btn-small btn-delete"
                    onClick={() => handleDeleteScript(script.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="modal active" onClick={(e) => {
          if (e.target === e.currentTarget) setShowModal(false);
        }}>
          <div className="modal-content">
            <div className="modal-header">
              {editingScriptId !== null ? 'Edit Script' : 'New Script'}
            </div>

            <div className="form-group">
              <label className="form-label">Script Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="My Awesome Script"
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL Pattern (Regex)</label>
              <input
                type="text"
                className="form-input"
                value={formData.urlPattern}
                onChange={(e) => setFormData({...formData, urlPattern: e.target.value})}
                placeholder=".*github\.com.*"
              />
              <div className="form-help">
                Use regex pattern to auto-inject on matching pages. Examples:<br/>
                • <code>.*github\.com.*</code> - Any GitHub page<br/>
                • <code>https://example\.com/.*</code> - All pages on example.com<br/>
                • Leave empty for manual execution only
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">JavaScript Code *</label>
              <textarea
                className="form-input form-textarea"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="console.log('Hello World!');\n\n// Your JavaScript code here..."
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                style={{flex: 1}}
                onClick={handleSaveScript}
              >
                💾 Save Script
              </button>
              <button
                className="btn btn-secondary"
                style={{flex: 1}}
                onClick={() => setShowModal(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;

