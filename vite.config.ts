import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools' // 1. Importa o plugin

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(), // 2. Adiciona-o aqui na lista de plugins
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
