import { copyFileSync, renameSync, readdirSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dist = resolve(__dirname, 'dist');

// Move HTML files from dist/src to dist root
const srcDir = resolve(dist, 'src');
try {
  const files = readdirSync(srcDir);
  for (const file of files) {
    if (file.endsWith('.html')) {
      renameSync(resolve(srcDir, file), resolve(dist, file));
      console.log(`Moved ${file} to dist root`);
    }
  }
  // Remove empty src directory
  rmSync(srcDir, { recursive: true, force: true });
  console.log('Cleaned up src directory');
} catch (e) {
  // Directory might not exist, that's okay
}

console.log('✅ Build post-processing complete');

