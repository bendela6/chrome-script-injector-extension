import ts from "typescript";

/**
 * Transpiles TypeScript code to JavaScript
 * @param code - The TypeScript or JavaScript code to transpile
 * @returns Transpiled JavaScript code
 */
export function transpileCode(code: string): string {
  try {
    const result = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.None,
        jsx: ts.JsxEmit.React,
        removeComments: false,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    });

    return result.outputText;
  } catch (error) {
    console.error("Failed to transpile code:", error);
    // If transpilation fails, return the original code
    // (it might already be valid JavaScript)
    return code;
  }
}
