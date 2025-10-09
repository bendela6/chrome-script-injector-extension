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

const Popup: React.FC = () => {
  const [scriptText, setScriptText] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [totalScripts, setTotalScripts] = useState(0);
  const [matchedScripts, setMatchedScripts] = useState(0);
  const [injecting, setInjecting] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const result = await chrome.storage.sync.get(['scripts']);
      const scripts: Script[] = result.scripts || [];

      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

      setTotalScripts(scripts.length);

      if (tab?.url) {
        setCurrentUrl(tab.url);

        const matchedCount = scripts.filter(script => {
          if (!script.urlPattern) return false;
          try {
            const regex = new RegExp(script.urlPattern);
            return regex.test(tab.url!);
          } catch (e) {
            return false;
          }
        }).length;

        setMatchedScripts(matchedCount);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleInject = async () => {
    if (!scriptText.trim()) {
      alert('Please enter some JavaScript code to inject.');
      return;
    }

    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    if (tab?.id) {
      try {
        setInjecting(true);
        await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: injectScript,
          args: [scriptText],
          world: 'MAIN'
        });

        setTimeout(() => setInjecting(false), 2000);
      } catch (error) {
        console.error("Script Injector: Error executing script.", error);
        alert('Failed to inject script. Check console for details.');
        setInjecting(false);
      }
    } else {
      alert("Could not find an active tab.");
    }
  };

  const openManagePage = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-[400px] min-h-[300px] font-sans bg-slate-50 m-0 p-0">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <h1 className="text-xl font-bold mb-2">🚀 Script Injector</h1>
        <p className="text-sm opacity-90">Quick injection & script management</p>
      </div>

      <div className="p-6">
        {currentUrl && (
          <div className="bg-sky-100 border border-sky-300 rounded-lg p-3 mb-4 text-xs text-sky-900">
            <div className="font-semibold mb-1">📍 Current Page:</div>
            <div className="break-all opacity-80">{currentUrl}</div>
          </div>
        )}

        <div className="bg-white border-2 border-slate-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Total Scripts</span>
            <span className="text-xl font-bold text-indigo-500">{totalScripts}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-500">Auto-Inject Active</span>
            <span className="text-xl font-bold text-indigo-500">{matchedScripts}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Quick Injection</div>
          <textarea
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            className="w-full h-[120px] p-3 bg-white border-2 border-slate-200 rounded-lg resize-y box-border font-mono text-sm transition-all focus:border-indigo-500 focus:outline-none"
            placeholder="Enter JavaScript code to inject...&#10;&#10;Example:&#10;alert('Hello World!');"
          />
          <button
            onClick={handleInject}
            className={`w-full px-4 py-3 border-none rounded-lg cursor-pointer font-semibold text-sm text-white shadow-lg mt-3 transition-all hover:shadow-xl ${
              injecting 
                ? 'bg-gradient-to-br from-green-500 to-green-600' 
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
            }`}
          >
            {injecting ? '✓ Injected Successfully!' : '▶ Inject Script Now'}
          </button>
        </div>

        <div className="h-px bg-slate-200 my-6" />

        <button
          onClick={openManagePage}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg cursor-pointer font-semibold text-sm bg-white text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300"
        >
          ⚙️ Manage All Scripts
        </button>
      </div>
    </div>
  );
};

export default Popup;
