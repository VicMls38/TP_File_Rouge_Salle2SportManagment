import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['../frontend/tests/unit/**/*.test.js'],
    exclude: [
      '**/services/*.test.js',
      '**/services/**/*.test.js'
    ]
  }
})
