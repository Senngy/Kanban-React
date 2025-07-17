import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
//import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [react(), ],
})
