import React from "react";
import { Button, Modal } from "../../components";
import { ScriptFormData } from "../../types.ts";

interface ScriptFormProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: ScriptFormData;
  onFormChange: (data: ScriptFormData) => void;
  onSave: () => void;
  onClose: () => void;
}

export const ScriptForm: React.FC<ScriptFormProps> = ({
  isOpen,
  isEditing,
  formData,
  onFormChange,
  onSave,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Script" : "New Script"}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Script Name *</label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
            value={formData.name}
            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
            placeholder="My Awesome Script"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            URL Pattern (Regex)
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all font-mono"
            value={formData.urlPattern}
            onChange={(e) => onFormChange({ ...formData, urlPattern: e.target.value })}
            placeholder=".*github\.com.*"
          />
          <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded">
            Use regex pattern to auto-inject on matching pages. Examples:
            <br />• <code className="bg-white px-1 py-0.5 rounded">.*github\.com.*</code> - Any
            GitHub page
            <br />• <code className="bg-white px-1 py-0.5 rounded">https://example\.com/.*</code> -
            All pages on example.com
            <br />• Leave empty for manual execution only
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            JavaScript Code *
          </label>
          <textarea
            className="w-full h-64 px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all font-mono text-sm resize-y"
            value={formData.code}
            onChange={(e) => onFormChange({ ...formData, code: e.target.value })}
            placeholder="console.log('Hello World!');\n\n// Your JavaScript code here..."
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={onSave} variant="primary" className="flex-1">
            💾 Save Script
          </Button>
          <Button onClick={onClose} variant="secondary" className="flex-1">
            ❌ Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
