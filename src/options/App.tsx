import { Header, MainScreen, ScriptForm } from "./components";
import { Sidebar } from "./Sidebar";
import { useScriptsContext } from "../providers";
import classNames from "classnames";

export function App() {
  const {
    scriptFormData, //
    setScriptFormChange,
    saveFormScript,
    closeScriptForm,
  } = useScriptsContext();

  return (
    <div
      className={classNames(
        "h-screen",
        "flex flex-col", //
        "overflow-hidden",
        "bg-slate-100"
      )}
    >
      <Header className="flex-none" />

      <div className="flex-1 overflow-hidden flex items-stretch">
        <Sidebar className="flex-none w-80" />
        {scriptFormData ? (
          <ScriptForm
            className="flex-1 overflow-hidden"
            formData={scriptFormData}
            onFormChange={setScriptFormChange}
            onSave={saveFormScript}
            onCancel={closeScriptForm}
          />
        ) : (
          <MainScreen className="flex-1" />
        )}
      </div>
    </div>
  );
}
