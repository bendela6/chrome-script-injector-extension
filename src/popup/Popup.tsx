import React, { useState, useEffect } from 'react';
import { Button } from '../components';
import { loadScripts, saveScripts, getCurrentTab } from '../utils/storage';
import { Script } from '../types';

const Popup: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [scripts, setScripts] = useState<Script[]>([]);
  const [activeScriptsCount, setActiveScriptsCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const scripts = await loadScripts();
      setScripts(scripts);

      const tab = await getCurrentTab();

      if (tab?.url) {
        setCurrentUrl(tab.url);

        const activeCount = scripts.filter((script) => {
          // Only count enabled scripts that match the URL
          if (!script.urlPattern || script.enabled === false) return false;
          try {
            const regex = new RegExp(script.urlPattern);
            return regex.test(tab.url!);
          } catch (e) {
            return false;
          }
        }).length;

        setActiveScriptsCount(activeCount);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const toggleScript = async (scriptId: number) => {
    try {
      const updatedScripts = scripts.map(script =>
        script.id === scriptId
          ? { ...script, enabled: !(script.enabled ?? true) }
          : script
      );

      await saveScripts(updatedScripts);
      setScripts(updatedScripts);

      // Recalculate active scripts count
      const tab = await getCurrentTab();
      if (tab?.url) {
        const activeCount = updatedScripts.filter((script) => {
          if (!script.urlPattern || script.enabled === false) return false;
          try {
            const regex = new RegExp(script.urlPattern);
            return regex.test(tab.url!);
          } catch (e) {
            return false;
          }
        }).length;
        setActiveScriptsCount(activeCount);
      }
    } catch (error) {
      console.error('Error toggling script:', error);
    }
  };

  const isScriptMatchingCurrentUrl = (script: Script): boolean => {
    if (!currentUrl || !script.urlPattern) return false;
    try {
      const regex = new RegExp(script.urlPattern);
      return regex.test(currentUrl);
    } catch (e) {
      return false;
    }
  };

  const openManagePage = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-[400px] max-h-[600px] font-sans bg-slate-50 m-0 p-0 overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <h1 className="text-xl font-bold mb-2">🚀 Script Injector</h1>
        <p className="text-sm opacity-90">Manage your JavaScript injection scripts</p>
      </div>

      <div className="p-6">
        <Button onClick={openManagePage} variant="primary" className="w-full mb-6">
          ⚙️ Manage All Scripts
        </Button>

        {currentUrl && (
          <div className="bg-sky-100 border border-sky-300 rounded-lg p-3 mb-4 text-xs text-sky-900">
            <div className="font-semibold mb-1">📍 Current Page:</div>
            <div className="break-all opacity-80">{currentUrl}</div>
          </div>
        )}

        <div className="bg-white border-2 border-slate-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Active Scripts on This Page</span>
            <span className="text-xl font-bold text-indigo-500">{activeScriptsCount}</span>
          </div>
        </div>

        {scripts.filter(script => isScriptMatchingCurrentUrl(script)).length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 mb-2">
              Matched Scripts ({scripts.filter(script => isScriptMatchingCurrentUrl(script)).length})
            </h2>
            {scripts.filter(script => isScriptMatchingCurrentUrl(script)).map((script) => {
              const isEnabled = script.enabled !== false; // Default to true if undefined

              return (
                <div
                  key={script.id}
                  className={`bg-white border rounded-lg p-3 shadow-sm ${
                    isEnabled ? 'border-green-400 bg-green-50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-slate-800 truncate">
                          {script.name}
                        </h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Matches
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate" title={script.urlPattern}>
                        {script.urlPattern}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleScript(script.id)}
                      className={`flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                      role="switch"
                      aria-checked={isEnabled}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm mb-2">No scripts match this page</p>
            <p className="text-xs">Click "Manage All Scripts" to add one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
