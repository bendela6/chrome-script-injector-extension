import { Button } from "../../components";
import { ScriptFormData } from "../../types.ts";
import { scriptRunAtOptions } from "../../utils";
import classNames from "classnames";
import { CodeInput } from "./CodeInput";
import { InputSelect } from "./InputSelect.tsx";

interface Props {
  className?: string;
  formData: ScriptFormData;
  onFormChange: (form: ScriptFormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ScriptForm({ className, formData, onFormChange, onSave, onCancel }: Props) {
  const isEditing = formData.id !== undefined;

  return (
    <div className={classNames(className, "flex flex-col")}>
      <div
        className={classNames(
          "flex flex-col gap-y-4",
          "flex-none",
          "px-4 py-2",
          "shadow-lg",
          "bg-gradient-to-t from-slate-50 to-slate-100" //
        )}
      >
        <div className={classNames("flex items-center justify-between")}>
          <h2 className="text-sm font-bold">{isEditing ? "✏️ Edit Script" : "➕ New Script"}</h2>

          <div className="flex items-center gap-x-2">
            <Button onClick={onCancel} variant="secondary" className="">
              ❌ Cancel
            </Button>

            <Button onClick={onSave} variant="primary" className="">
              💾 Save
            </Button>
          </div>
        </div>

        <div className={classNames("flex-none  grid grid-cols-12 gap-x-2")}>
          <div className="col-span-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Script Name *</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              placeholder="My Awesome Script"
            />
          </div>
          <div className="col-span-4">
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
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Run At</label>
            <InputSelect
              options={scriptRunAtOptions}
              value={formData.runAt}
              onChange={(runAt) =>
                onFormChange({
                  ...formData,
                  runAt,
                })
              }
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Enabled</label>
            <InputSelect
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              value={formData.enabled ? "yes" : "no"}
              onChange={(value) =>
                onFormChange({
                  ...formData,
                  enabled: value === "yes",
                })
              }
            />
          </div>
        </div>
      </div>

      <CodeInput
        value={formData.code}
        onChange={(code) => {
          onFormChange({ ...formData, code });
        }}
      />
    </div>
  );
}
