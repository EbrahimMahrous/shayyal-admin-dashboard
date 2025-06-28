import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/shayyal-admin-dashboard/',
  server: {
    proxy: {
      "/mock": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mock/, ""),
      },
    },
  },
})
