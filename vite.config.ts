import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    host: "frontend.rpg.local",
    port: 5173,
    https: true,
  },
})
