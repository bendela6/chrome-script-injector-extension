import { ScriptDto, ScriptRunAt } from "../../types";
import { useScriptsContext } from "../../providers";
import classNames from "classnames";
import { variant } from "../../utils";

interface Props {
  script: ScriptDto;
}

export function ScriptCard({ script }: Props) {
  const { scriptFormData, openScriptForm, deleteScript } = useScriptsContext();

  const scriptIsSelected = (script: ScriptDto) => {
    return scriptFormData?.id === script.id;
  };

  return (
    <div
      key={script.id}
      className={classNames(
        "cursor-pointer",
        "p-4",
        "hover:bg-slate-50",
        "transition-colors",
        "border-l-4",
        {
          "opacity-50": !script.enabled,
          "bg-blue-50 border-blue-600": scriptIsSelected(script),
        }
      )}
      onClick={() => openScriptForm(script)}
    >
      <div className="font-semibold text-slate-800 mb-2 text-sm">{script.name}</div>
      <div className="text-xs text-slate-500 font-mono mb-2 truncate">{script.urlPattern}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
            {variant(script.runAt, {
              [ScriptRunAt.DocumentStart]: "⚡ Document Start",
              [ScriptRunAt.DocumentEnd]: "📄 Document End",
              [ScriptRunAt.DocumentIdle]: "⏳ Document Idle",
            })}
          </div>
          <div
            className={classNames(
              "text-xs px-2 py-1 rounded",
              script.enabled //
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {script.enabled ? "Enabled" : "Disabled"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => deleteScript(script)}
          className="text-red-500 hover:text-red-700 text-2xl font-medium"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
