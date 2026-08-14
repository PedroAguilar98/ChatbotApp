import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Custom element build: a single IIFE (React bundled in) that self-registers
// `<chatbot-widget>` as soon as it's loaded via <script src="...">. For hosts
// on any framework (Vue, Angular, plain HTML/JS) — see src/webcomponent/.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/webcomponent/index.ts'),
      name: 'ChatbotWidgetElement',
      formats: ['iife'],
      fileName: () => 'chatbot-widget-element.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
})
