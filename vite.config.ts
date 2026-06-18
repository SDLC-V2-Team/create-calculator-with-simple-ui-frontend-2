import { defineConfig } from 'vite';

// Vite serves the public/ web UI and bundles the TypeScript engine for the browser.
export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist-web',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    open: true
  }
});
