import { ScriptDto } from "../types";

export function isScriptUrlMatched(script: ScriptDto, url: string): boolean {
  if (!url || url.startsWith("chrome://") || url.startsWith("chrome-extension://")) {
    return false;
  }
  const regex = new RegExp(script.urlPattern);
  return regex.test(url);
}
