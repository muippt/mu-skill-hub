import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 仓库地址: muippt.github.io/mu-skill-hub
  base: '/mu-skill-hub/',
  server: {
    host: '::',
    port: '8080',
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: 'lib',
        replacement: resolve(__dirname, 'lib'),
      },
    ],
  },
});
