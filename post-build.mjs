import {existsSync, readdirSync, renameSync, rmSync} from "fs";
import {dirname, resolve} from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dist = resolve(__dirname, "dist");

// Move HTML files from nested directories to dist root
const moveHtmlFiles = (dir) => {
  try {
    if (!existsSync(dir)) return;

    const files = readdirSync(dir);
    for (const file of files) {
      const fullPath = resolve(dir, file);
      if (file.endsWith(".html")) {
        const targetName = dir.includes("popup")
          ? "popup.html"
          : dir.includes("options")
            ? "options.html"
            : file;
        renameSync(fullPath, resolve(dist, targetName));
        console.log(`Moved ${file} to dist root as ${targetName}`);
      }
    }
  } catch (e) {
    console.warn(`Could not process ${dir}:`, e.message);
  }
};

// Process popup and options directories
moveHtmlFiles(resolve(dist, "src/popup"));
moveHtmlFiles(resolve(dist, "src/options"));

// Clean up the src directory structure
try {
  if (existsSync(resolve(dist, "src"))) {
    rmSync(resolve(dist, "src"), {recursive: true, force: true});
    console.log("Cleaned up src directory");
  }
} catch (e) {
  console.warn("Could not clean up src directory:", e.message);
}

console.log("✅ Build post-processing complete");
