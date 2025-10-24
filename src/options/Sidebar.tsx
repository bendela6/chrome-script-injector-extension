import { useScriptsContext } from "./ScriptsProvider";
import { useState } from "react";
import { ScriptCard } from "./components";
import classNames from "classnames";

interface Props {
  className?: string;
}

export function Sidebar({ className }: Props) {
  const { scripts, openScriptForm } = useScriptsContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScripts = scripts.filter((script) => {
    return (
      !searchQuery ||
      script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.urlPattern.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div
      className={classNames(
        className,
        "flex flex-col",
        "overflow-y-auto",
        "bg-white",
        "border-r border-slate-200"
      )}
    >
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scripts..."
            className="w-full pl-9 pr-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all text-sm"
          />
        </div>
        <button
          onClick={() => openScriptForm()}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow hover:shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 text-sm"
        >
          ➕ New Script
        </button>
      </div>

      {/* Scripts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredScripts.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm">{searchQuery ? "No scripts found" : "No scripts yet"}</p>
            {!searchQuery && (
              <button
                onClick={() => openScriptForm()}
                className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Create your first script
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredScripts.map((script) => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
