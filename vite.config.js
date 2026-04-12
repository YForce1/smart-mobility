import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // listen on all interfaces — required for tunnels & LAN access
    port: 5173,
    strictPort: true,  // fail if 5173 is taken, don't silently switch ports
  }
})
