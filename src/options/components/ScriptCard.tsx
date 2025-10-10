import React from "react";
import { ScriptDto, ScriptRunAt } from "../../types";
import { Button } from "../../components";

interface ScriptCardProps {
  script: ScriptDto;
  onEdit: (script: ScriptDto) => void;
  onDelete: (script: ScriptDto) => void;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({ script, onEdit, onDelete }) => {
  const getRunAtLabel = (runAt?: string) => {
    switch (runAt) {
      case ScriptRunAt.DocumentStart:
        return "⚡ Document Start";
      case ScriptRunAt.DocumentEnd:
        return "📄 Document End";
      default:
        return "⏳ Document Idle";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-slate-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="text-xl font-bold text-slate-800">{script.name}</div>
        </div>

        <div
          className={`text-sm mb-4 px-3 py-2 rounded font-mono ${
            script.urlPattern ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500 italic"
          }`}
        >
          {script.urlPattern || "No URL pattern (manual only)"}
        </div>

        <div className="text-sm mb-4 px-3 py-2 rounded bg-purple-100 text-purple-800">
          {getRunAtLabel(script.runAt)}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => onEdit(script)} variant="warning" className="flex-1">
            ✏ Edit
          </Button>
          <Button onClick={() => onDelete(script)} variant="danger" className="flex-1">
            🗑 Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
