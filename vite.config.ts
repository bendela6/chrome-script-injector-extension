import { build, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, cpSync, existsSync, mkdirSync } from "fs";

const outDir = resolve(__dirname, "dist");

const scriptEntries = {
  background: resolve(__dirname, "src/background.ts"),
};

// Main build config for popup/options pages
export default defineConfig({
  plugins: [
    react(),
    {
      name: "build-scripts-and-copy-assets",
      async closeBundle() {
        // Build each script individually
        for (const [entryName, entryPath] of Object.entries(scriptEntries)) {
          await build({
            // Prevent the build from recursively loading this config file
            configFile: false,
            build: {
              outDir,
              lib: {
                entry: entryPath,
                name: entryName,
                formats: ["iife"],
                fileName: () => `${entryName}.js`,
              },
              emptyOutDir: false,
              copyPublicDir: false,
            },
          });
        }

        // Copy manifest and assets after all builds are complete
        if (!existsSync(outDir)) {
          mkdirSync(outDir);
        }
        copyFileSync(resolve(__dirname, "src/manifest.json"), resolve(outDir, "manifest.json"));
        cpSync(resolve(__dirname, "src/assets"), outDir, { recursive: true });
      },
    },
  ],
  build: {
    outDir,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
        options: resolve(__dirname, "src/options/index.html"),
      },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
});
