import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, cpSync, existsSync, mkdirSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-manifest",
      closeBundle() {
        const dist = resolve(__dirname, "dist");
        if (!existsSync(dist)) {
          mkdirSync(dist);
        }
        // Copy manifest and icon
        copyFileSync(resolve(__dirname, "src/manifest.json"), resolve(dist, "manifest.json"));
        cpSync(resolve(__dirname, "src/assets"), resolve(dist), { recursive: true });
      },
    },
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
        options: resolve(__dirname, "src/options/index.html"),
        background: resolve(__dirname, "src/background.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "background" ? "[name].js" : "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: () => "assets/[name]-[hash].[ext]",
      },
    },
  },
});
