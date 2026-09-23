import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The workbench API runs separately on :8000. Proxying keeps the browser on one
  // origin in dev, so no CORS preflight and no absolute URLs in the client.
  server: {
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
})
