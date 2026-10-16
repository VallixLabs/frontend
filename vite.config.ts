import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The workbench API runs separately on :8000. Proxying keeps the browser on one
  // origin in dev, so no CORS preflight and no absolute URLs in the client
  // (VITE_API_BASE stays unset). /auth is proxied too, for sign-out; the Google
  // sign-in itself returns to the backend's own redirect URI, and the session
  // cookie it sets for localhost is sent here as well, because cookies are scoped
  // by host, not by port.
  server: {
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/auth': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
})
