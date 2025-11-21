import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/healthz': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Proxy short codes to backend for redirect
      '^/[a-zA-Z0-9]+$': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})