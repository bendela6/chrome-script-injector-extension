import React, { useState, useEffect } from 'react';
import { Script } from './types';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">🚀 Script Injector - Manage Scripts</h1>
        <p className="text-lg opacity-90">Create and manage your JavaScript injection scripts with automatic URL matching</p>
      </div>

      {currentUrl && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mx-8 mt-6 rounded shadow-sm">
          <span className="font-semibold">📍 Current Page:</span> {currentUrl}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-blue-500">
          <div className="text-4xl font-bold text-blue-600 mb-2">{stats.total}</div>
          <div className="text-sm text-slate-600 uppercase tracking-wide">Total Scripts</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-purple-500">
          <div className="text-4xl font-bold text-purple-600 mb-2">{stats.autoInject}</div>
          <div className="text-sm text-slate-600 uppercase tracking-wide">Auto-Inject Scripts</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-green-500">
          <div className="text-4xl font-bold text-green-600 mb-2">{stats.matched}</div>
          <div className="text-sm text-slate-600 uppercase tracking-wide">Active on Current Page</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scripts by name or URL pattern..."
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
        <button
          onClick={handleNewScript}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:from-blue-700 hover:to-purple-700"
        >
          ➕ New Script
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {filteredScripts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {searchQuery ? 'No Scripts Found' : 'No Scripts Yet'}
            </h2>
            <p className="text-slate-600 mb-6">
              {searchQuery ? `No scripts match "${searchQuery}"` : 'Create your first script to get started with automatic injection'}
            </p>
            {!searchQuery && (
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={handleNewScript}
              >
                ➕ Create First Script
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredScripts.map(script => {
              const isMatched = isScriptMatched(script);
              const codePreview = script.code.length > 150
                ? script.code.substring(0, 150) + '...'
                : script.code;

              return (
                <div
                  key={script.id}
                  className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all border-2 ${
                    isMatched ? 'border-green-400 bg-green-50' : 'border-slate-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-xl font-bold text-slate-800">{script.name}</div>
                      {isMatched && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          ✓ AUTO-INJECTED
                        </span>
                      )}
                    </div>

                    <div className={`text-sm mb-4 px-3 py-2 rounded font-mono ${
                      script.urlPattern 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-slate-100 text-slate-500 italic'
                    }`}>
                      {script.urlPattern || 'No URL pattern (manual only)'}
                    </div>

                    <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-xs text-slate-700 mb-4 overflow-x-auto">
                      {codePreview}
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold text-sm transition-all"
                        onClick={() => handleRunScript(script)}
                      >
                        ▶ Run
                      </button>
                      <button
                        className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold text-sm transition-all"
                        onClick={() => handleEditScript(script)}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm transition-all"
                        onClick={() => handleDeleteScript(script.id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">
                {editingScriptId !== null ? 'Edit Script' : 'New Script'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Script Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="My Awesome Script"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  URL Pattern (Regex)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all font-mono"
                  value={formData.urlPattern}
                  onChange={(e) => setFormData({...formData, urlPattern: e.target.value})}
                  placeholder=".*github\.com.*"
                />
                <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded">
                  Use regex pattern to auto-inject on matching pages. Examples:<br/>
                  • <code className="bg-white px-1 py-0.5 rounded">.*github\.com.*</code> - Any GitHub page<br/>
                  • <code className="bg-white px-1 py-0.5 rounded">https://example\.com/.*</code> - All pages on example.com<br/>
                  • Leave empty for manual execution only
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  JavaScript Code *
                </label>
                <textarea
                  className="w-full h-64 px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all font-mono text-sm resize-y"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="console.log('Hello World!');\n\n// Your JavaScript code here..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg"
                  onClick={handleSaveScript}
                >
                  💾 Save Script
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-all"
                  onClick={() => setShowModal(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;
