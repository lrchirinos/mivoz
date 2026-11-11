import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5188,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 5188,
    strictPort: true,
    host: true,
  },
})
