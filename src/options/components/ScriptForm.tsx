import { Button, Input, Form } from "antd";
import { ScriptFormData } from "../../types.ts";
import { scriptEnabledOptions, scriptRunAtOptions } from "../../utils";
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

  const fields = Object.entries(formData).map(([name, value]) => ({
    name: [name],
    value,
  }));

  const handleValuesChange = (changedValues: Partial<ScriptFormData>) => {
    onFormChange?.({ ...formData, ...changedValues });
  };

  return (
    <div className={classNames(className, "flex flex-col overflow-hidden")}>
      <div
        className={classNames(
          "flex-none",
          "flex flex-col gap-y-4",
          "px-4 py-2",
          "shadow-lg",
          "bg-gradient-to-t from-slate-50 to-slate-100"
        )}
      >
        <div className={classNames("flex items-center justify-between")}>
          <h2 className="text-sm font-bold">{isEditing ? "✏️ Edit Script" : "➕ New Script"}</h2>

          <div className="flex items-center gap-x-2">
            <Button type="default" onClick={onCancel}>
              ❌ Cancel
            </Button>

            <Button type="primary" onClick={onSave}>
              💾 Save
            </Button>
          </div>
        </div>

        <Form
          fields={fields}
          onValuesChange={(_, payload) => handleValuesChange(payload)}
          layout="vertical"
        >
          <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-4">
              <Form.Item name="name" label="Script Name *" className="mb-0">
                <Input placeholder="My Awesome Script" />
              </Form.Item>
            </div>
            <div className="col-span-4">
              <Form.Item name="urlPattern" label="URL Pattern (Regex)" className="mb-0">
                <Input placeholder=".*github\.com.*" style={{ fontFamily: "monospace" }} />
              </Form.Item>
            </div>
            <div className="col-span-2">
              <Form.Item name="runAt" label="Run At" className="mb-0">
                <InputSelect options={scriptRunAtOptions} />
              </Form.Item>
            </div>
            <div className="col-span-2">
              <Form.Item name="enabled" label="Enabled" className="mb-0">
                <InputSelect options={scriptEnabledOptions} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>

      <div className="flex-grow overflow-hidden">
        <CodeInput
          className="w-full h-full"
          value={formData.code}
          onChange={(code) => {
            onFormChange({ ...formData, code });
          }}
        />
      </div>
      <div className="flex-none h-4 bg-gradient-to-t from-slate-50 to-slate-100" />
    </div>
  );
}
