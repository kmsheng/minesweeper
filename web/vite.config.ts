import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    checker({ vueTsc: true }),
    vue()
  ],
  build: {
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  }
})
