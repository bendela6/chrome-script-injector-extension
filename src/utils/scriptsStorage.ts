import { ScriptDto, ScriptFormData } from "../types";
import { Store } from "./store.ts";

export const scriptsStore = new Store<ScriptDto[]>([]);

const STORAGE_KEY = "scripts";

export function startScriptsStorageListener() {
  chrome.storage.sync.get([STORAGE_KEY]).then((result) => {
    const scripts = result[STORAGE_KEY] || [];
    scriptsStore.setData(scripts);
  });

  const changesListener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) => {
    if (areaName === "sync" && changes[STORAGE_KEY]) {
      scriptsStore.setData(changes[STORAGE_KEY].newValue || []);
    }
  };

  chrome.storage.onChanged.addListener(changesListener);
  return () => {
    chrome.storage.onChanged.removeListener(changesListener);
  };
}

export const scriptsActions = {
  async saveScripts(scripts: ScriptDto[]): Promise<void> {
    await chrome.storage.sync.set({
      [STORAGE_KEY]: scripts,
    });
  },

  async createScript(payload: ScriptFormData): Promise<void> {
    const scripts = scriptsStore.getData();
    const newScript: ScriptDto = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    scripts.push(newScript);
    await this.saveScripts(scripts);
  },

  async updateScript(
    id: string,
    fnOrPayload: Partial<ScriptFormData> | ((script: ScriptFormData) => ScriptFormData)
  ): Promise<void> {
    const scripts = scriptsStore.getData();
    const index = scripts.findIndex((script) => script.id === id);
    if (index !== -1) {
      const script = scripts[index];
      const formData =
        typeof fnOrPayload === "function" ? fnOrPayload(script) : { ...script, ...fnOrPayload };

      scripts[index] = {
        ...formData,
        id: script.id,
        createdAt: script.createdAt,
        updatedAt: new Date().toISOString(),
      };
      await this.saveScripts(scripts);
    }
  },

  async deleteScript(id: string): Promise<void> {
    const scripts = scriptsStore.getData();
    const updatedScripts = scripts.filter((script) => script.id !== id);
    await this.saveScripts(updatedScripts);
  },
};
