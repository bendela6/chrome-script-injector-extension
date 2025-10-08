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
    <div style={{ width: '400px', minHeight: '300px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f8fafc', margin: 0, padding: 0 }}>
      <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>🚀 Script Injector</h1>
        <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>Quick injection & script management</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {currentUrl && (
          <div style={{ background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#0c4a6e' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>📍 Current Page:</div>
            <div style={{ wordBreak: 'break-all', opacity: 0.8 }}>{currentUrl}</div>
          </div>
        )}

        <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Scripts</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#667eea' }}>{totalScripts}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Auto-Inject Active</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#667eea' }}>{matchedScripts}</span>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Injection</div>
          <textarea
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            style={{ width: '100%', height: '120px', padding: '0.75rem', backgroundColor: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '0.5rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.875rem', transition: 'all 0.2s' }}
            placeholder="Enter JavaScript code to inject...&#10;&#10;Example:&#10;alert('Hello World!');"
          />
          <button
            onClick={handleInject}
            style={{ width: '100%', padding: '0.75rem 1rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', background: injecting ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)', marginTop: '0.75rem', transition: 'all 0.2s' }}
          >
            {injecting ? '✓ Injected Successfully!' : '▶ Inject Script Now'}
          </button>
        </div>

        <div style={{ height: '1px', background: '#e2e8f0', margin: '1.5rem 0' }} />

        <button
          onClick={openManagePage}
          style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', background: 'white', color: '#475569', transition: 'all 0.2s' }}
        >
          ⚙️ Manage All Scripts
        </button>
      </div>
    </div>
  );
};

export default Popup;

