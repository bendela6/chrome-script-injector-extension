import { registerContentScripts } from "./content.ts";
import { ScriptRunAt } from "./types.ts";

(async () => {
  await registerContentScripts(ScriptRunAt.DocumentStart);
})();
