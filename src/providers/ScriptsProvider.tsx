import React, { createContext, ReactNode, useEffect, useState } from "react";
import { ScriptDto, ScriptFormData } from "../types.ts";
import {
  initialFormData,
  scriptsActions,
  scriptsStore,
  startScriptsStorageListener,
} from "../utils";

type ContextValue = {
  scripts: ScriptDto[];

  scriptFormData: ScriptFormData | undefined;
  setScriptFormChange: (form: ScriptFormData) => void;

  openScriptForm: (script?: ScriptDto) => void;
  closeScriptForm: () => void;
  saveFormScript: () => void;

  deleteScript: (script: ScriptDto) => void;
};

const Context = createContext<ContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function ScriptsProvider({ children }: Props) {
  const [scripts, setScripts] = useState<ScriptDto[]>([]);
  const [scriptFormData, setScriptFormChange] = useState<ScriptFormData>();

  useEffect(() => {
    void startScriptsStorageListener();
    return scriptsStore.subscribe(setScripts);
  }, []);

  const openScriptForm = (script?: ScriptDto): void => {
    setScriptFormChange(script ? { ...script } : initialFormData);
  };

  const closeScriptForm = (): void => {
    setScriptFormChange(undefined);
  };

  const saveFormScript = async () => {
    if (!scriptFormData) return;
    const { name, urlPattern, code } = scriptFormData;

    if (!name.trim() || !code.trim()) {
      alert("Please fill in the script name and code.");
      return;
    }

    if (urlPattern) {
      try {
        new RegExp(urlPattern);
      } catch (e) {
        alert("Invalid regex pattern for URL. Please check your pattern.");
        return;
      }
    }

    void scriptsActions.saveScript(scriptFormData);
  };

  const deleteScript = (script: ScriptDto): void => {
    if (confirm(`Are you sure you want to remove "${script?.name}"?`)) {
      void scriptsActions.removeScript(script.id);
    }
  };

  const value: ContextValue = {
    scripts,

    scriptFormData,
    setScriptFormChange,

    openScriptForm,
    closeScriptForm,

    saveFormScript,
    deleteScript,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useScriptsContext(): ContextValue {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error("useScriptsContext must be used within an ScriptsProvider");
  }
  return context;
}
