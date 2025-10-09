import React, { useState, useEffect } from 'react';
import { Button } from '../components';
import { loadScripts, getCurrentTab } from '../utils/storage';

const Popup: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [matchedScripts, setMatchedScripts] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const scripts = await loadScripts();
      const tab = await getCurrentTab();

      if (tab?.url) {
        setCurrentUrl(tab.url);

        const matchedCount = scripts.filter((script) => {
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

  const openManagePage = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-[400px] min-h-[250px] font-sans bg-slate-50 m-0 p-0">
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

        <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Active Scripts on This Page</span>
            <span className="text-xl font-bold text-indigo-500">{matchedScripts}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;

