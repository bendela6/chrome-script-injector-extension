import { ScriptDto, ScriptFormData, ScriptRunAt } from "../types";
import { Store } from "./store.ts";

export const scriptsStore = new Store<ScriptDto[]>([]);

const STORAGE_KEY = "scripts";

export const initialFormData: ScriptFormData = {
  name: "",
  urlPattern: "",
  code: "",
  enabled: true,
  runAt: ScriptRunAt.DocumentIdle,
};

export const scriptRunAtOptions = [
  { label: "⚡ Document Start", value: ScriptRunAt.DocumentStart },
  { label: "📄 Document End", value: ScriptRunAt.DocumentEnd },
  { label: "⏳ Document Idle", value: ScriptRunAt.DocumentIdle },
];

export const scriptEnabledOptions = [
  { label: "Enabled", value: true },
  { label: "Disabled", value: false },
];

export async function startScriptsStorageListener() {
  const result = await chrome.storage.sync.get([STORAGE_KEY]);
  scriptsStore.setData(result[STORAGE_KEY] || []);

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

  async saveScript(script: ScriptFormData): Promise<void> {
    if (script.id) {
      await this.updateScript(script.id, script);
    } else {
      await this.createScript(script);
    }
  },

  async removeScript(id: string): Promise<void> {
    const scripts = scriptsStore.getData();
    const updatedScripts = scripts.filter((script) => script.id !== id);
    await this.saveScripts(updatedScripts);
  },
};
