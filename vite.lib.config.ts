import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Library build for hosts that already have React in their own dependency
// tree (npm consumers). React/ReactDOM are left external (peer deps) so
// they're not duplicated in the host's bundle. Types are generated
// separately via `npm run build:types` (tsconfig.lib.json).
// See vite.standalone.config.ts for the no-bundler <script> variant, and
// vite.webcomponent.config.ts for the <chatbot-widget> custom element.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ChatbotWidget',
      formats: ['es', 'umd'],
      fileName: (format) => `chatbot-widget.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
})
