import React from 'react';
import { ScriptDto } from '../../types';
import { Button } from '../../components';

interface ScriptCardProps {
  script: ScriptDto;
  onEdit: (script: ScriptDto) => void;
  onDelete: (script: ScriptDto) => void;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({ script, onEdit, onDelete }) => {
  const codePreview = script.code.length > 150
    ? script.code.substring(0, 150) + '...'
    : script.code;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-slate-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="text-xl font-bold text-slate-800">{script.name}</div>
        </div>

        <div className={`text-sm mb-4 px-3 py-2 rounded font-mono ${
          script.urlPattern 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-slate-100 text-slate-500 italic'
        }`}>
          {script.urlPattern || 'No URL pattern (manual only)'}
        </div>

        <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-xs text-slate-700 mb-4 overflow-x-auto">
          {codePreview}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(script)}
            variant="warning"
            className="flex-1"
          >
            ✏ Edit
          </Button>
          <Button
            onClick={() => onDelete(script)}
            variant="danger"
            className="flex-1"
          >
            🗑 Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
