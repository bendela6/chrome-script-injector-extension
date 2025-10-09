import { Script } from '../types';

/**
 * Load all scripts from Chrome storage
 */
export const loadScripts = async (): Promise<Script[]> => {
  const result = await chrome.storage.sync.get(['scripts']);
  return result.scripts || [];
};

/**
 * Save scripts to Chrome storage
 */
export const saveScripts = async (scripts: Script[]): Promise<void> => {
  await chrome.storage.sync.set({ scripts });
};

/**
 * Get the current active tab
 */
export const getCurrentTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

/**
 * Check if a script matches the current URL
 */
export const isScriptMatched = (script: Script, url: string): boolean => {
  if (!url || !script.urlPattern) return false;
  try {
    const regex = new RegExp(script.urlPattern);
    return regex.test(url);
  } catch (e) {
    return false;
  }
};

