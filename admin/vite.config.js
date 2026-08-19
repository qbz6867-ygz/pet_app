import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  publicDir: '../app/static',
  server: {
    host: true,
    port: 5274
  }
})
