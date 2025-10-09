import React, { useEffect, useState } from "react";
import { Script } from "../types";
import { loadScripts, saveScripts } from "../utils/storage";
import { EmptyState, PageHeader, ScriptForm, ScriptGrid, SearchBar } from "./components";

const Options: React.FC = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [editingScriptId, setEditingScriptId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    urlPattern: "",
    code: ""
  });

  useEffect(() => {
    void loadAndRenderScripts();
  }, []);

  const loadAndRenderScripts = async () => {
    const loadedScripts = await loadScripts();
    setScripts(loadedScripts);
  };

  const handleSaveScripts = async (newScripts: Script[]) => {
    await saveScripts(newScripts);
    setScripts(newScripts);
  };

  const filteredScripts = scripts.filter(script =>
    !searchQuery ||
    script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (script.urlPattern && script.urlPattern.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleNewScript = () => {
    setEditingScriptId(null);
    setFormData({ name: "", urlPattern: "", code: "" });
    setShowModal(true);
  };

  const handleEditScript = (script: Script) => {
    setEditingScriptId(script.id);
    setFormData({
      name: script.name,
      urlPattern: script.urlPattern || "",
      code: script.code
    });
    setShowModal(true);
  };

  const handleSaveScript = async () => {
    const { name, urlPattern, code } = formData;

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

    await handleSaveScripts(newScripts);
    setShowModal(false);
  };

  const handleDeleteScript = async (scriptId: number) => {
    const script = scripts.find(s => s.id === scriptId);
    if (confirm(`Are you sure you want to delete "${script?.name}"?`)) {
      const newScripts = scripts.filter(s => s.id !== scriptId);
      await handleSaveScripts(newScripts);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <PageHeader/>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewScript={handleNewScript}
      />

      <div className="max-w-7xl mx-auto px-8 py-6">
        {filteredScripts.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            onNewScript={handleNewScript}
          />
        ) : (
          <ScriptGrid
            scripts={filteredScripts}
            onEdit={handleEditScript}
            onDelete={handleDeleteScript}
          />
        )}
      </div>

      <ScriptForm
        isOpen={showModal}
        isEditing={editingScriptId !== null}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSaveScript}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Options;
