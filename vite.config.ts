import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        const dist = resolve(__dirname, 'dist');
        if (!existsSync(dist)) {
          mkdirSync(dist);
        }
        // Copy manifest and icon
        copyFileSync(resolve(__dirname, 'src/manifest.json'), resolve(dist, 'manifest.json'));
        copyFileSync(resolve(__dirname, 'src/assets/icon16.png'), resolve(dist, 'icon16.png'));
        copyFileSync(resolve(__dirname, 'src/assets/icon48.png'), resolve(dist, 'icon48.png'));
        copyFileSync(resolve(__dirname, 'src/assets/icon128.png'), resolve(dist, 'icon128.png'));
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        background: resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'background' ? '[name].js' : 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.html')) {
            return '[name].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
});
