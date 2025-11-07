import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // ❌ relative './' → ✅ absolute '/'
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://your-backend-service.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
