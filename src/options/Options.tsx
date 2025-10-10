import { useEffect, useState } from "react";
import { ScriptDto, ScriptFormData, ScriptRunAt } from "../types";
import { scriptsActions, scriptsStore, startScriptsStorageListener } from "../utils";
import { EmptyState, PageHeader, ScriptCard, ScriptForm, SearchBar } from "./components";

const initialFormData: ScriptFormData = {
  name: "",
  urlPattern: "",
  code: "",
  enabled: true,
  runAt: ScriptRunAt.DocumentIdle,
};

export function Options() {
  const [scripts, setScripts] = useState<ScriptDto[]>([]);
  const [editingScriptId, setEditingScriptId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ScriptFormData>(initialFormData);

  useEffect(() => startScriptsStorageListener(), []);
  useEffect(() => scriptsStore.subscribe(setScripts), []);

  const filteredScripts = scripts.filter((script) => {
    return (
      !searchQuery ||
      script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.urlPattern.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleScriptCreate = () => {
    setEditingScriptId(undefined);
    setFormData(initialFormData);
    setShowForm(true);
  };

  const handleScriptEdit = (script: ScriptDto) => {
    setEditingScriptId(script.id);
    setFormData(script);
    setShowForm(true);
  };

  const handleScriptSave = async () => {
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

    if (editingScriptId) {
      void scriptsActions.updateScript(editingScriptId, formData);
    } else {
      void scriptsActions.createScript(formData);
    }
    setShowForm(false);
  };

  const handleScriptDelete = async (script: ScriptDto) => {
    if (confirm(`Are you sure you want to delete "${script?.name}"?`)) {
      void scriptsActions.deleteScript(script.id);
    }
  };

  // Show form page
  if (showForm) {
    return (
      <ScriptForm
        isEditing={editingScriptId !== undefined}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleScriptSave}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  // Show scripts list page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <PageHeader />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewScript={handleScriptCreate}
      />

      <div className="max-w-7xl mx-auto px-8 py-6">
        {filteredScripts.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onNewScript={handleScriptCreate} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onEdit={handleScriptEdit}
                onDelete={handleScriptDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
