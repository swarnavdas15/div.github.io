import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // ❌ relative './' → ✅ absolute '/'
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Local development backend
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
