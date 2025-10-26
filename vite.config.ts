import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cloudflare from '@cloudflare/vite-plugin'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      getPlatformProxy: () => ({
        // Configuration for the local server
      }),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  server: {
    hmr: {
      protocol: 'wss',
      clientPort: 443,
    },
  },
})