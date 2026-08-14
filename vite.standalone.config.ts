import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Standalone build for hosts with no bundler: a single IIFE with React
// bundled in, loadable directly via <script src="...">. Exposes the same
// public API as the npm package under `window.ChatbotWidget`.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ChatbotWidget',
      formats: ['iife'],
      fileName: () => 'chatbot-widget.standalone.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
})
