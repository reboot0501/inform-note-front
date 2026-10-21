import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 7080,
      proxy: {
        '/feature': {
          target: 'http://127.0.0.1:9093',
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: 'http://127.0.0.1:9093',
          changeOrigin: true,
          secure: false,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ''),
        },
      },
    },
  }
})