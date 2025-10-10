import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { Button } from "../../components";
import { ScriptFormData } from "../../types.ts";

interface ScriptFormProps {
  isEditing: boolean;
  formData: ScriptFormData;
  onFormChange: (data: ScriptFormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ScriptForm: React.FC<ScriptFormProps> = ({
  isEditing,
  formData,
  onFormChange,
  onSave,
  onCancel,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.max(textarea.scrollHeight, 400) + "px";
    }
  }, [formData.code]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-12">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">Back to Scripts</span>
          </button>
          <h1 className="text-4xl font-bold text-slate-900">
            {isEditing ? "Edit Script" : "New Script"}
          </h1>
          <p className="text-slate-600 mt-2">
            {isEditing
              ? "Update your script details below"
              : "Create a new script to inject into web pages"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Script Name *
              </label>
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
                <br />•{" "}
                <code className="bg-white px-1 py-0.5 rounded">https://example\.com/.*</code> - All
                pages on example.com
                <br />• Leave empty for manual execution only
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                JavaScript Code *
              </label>
              <div className="rounded-lg border-2 border-slate-200 focus-within:border-blue-500 transition-all overflow-hidden">
                <CodeMirror
                  value={formData.code}
                  height="100%"
                  extensions={[
                    javascript({
                      jsx: true,
                      typescript: true,
                    }),
                    EditorView.theme({
                      "*": {
                        fontSize: "16px",
                        lineHeight: "24px",
                      },
                    }),
                  ]}
                  theme="dark"
                  onChange={(code) => {
                    onFormChange({ ...formData, code });
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={onSave} variant="primary" className="flex-1">
                💾 Save Script
              </Button>
              <Button onClick={onCancel} variant="secondary" className="flex-1">
                ❌ Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
