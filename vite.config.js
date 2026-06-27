import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // این خط را اضافه کنید

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // این خط را اضافه کنید
  ],
})