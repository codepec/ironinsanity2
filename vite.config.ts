import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ironinsanity2/', // <--- wichtig für GitHub Pages
})