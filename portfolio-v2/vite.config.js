import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/PorTfolio-React/ on GitHub Pages.
  base: process.env.GITHUB_PAGES ? '/PorTfolio-React/' : '/',
  plugins: [react()],
  // Dev: forward /api to the local agent server (api/server.mjs). In prod this
  // path is served by the deployed Function (e.g. Azure) at the same origin.
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});
