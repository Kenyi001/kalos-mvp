import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})