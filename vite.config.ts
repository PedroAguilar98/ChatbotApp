import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This builds the local dev/demo harness (main.tsx -> initChatbot on #root).
// Output goes to `dist-demo`, kept separate from `dist/`, which is reserved
// for the published library artifacts — see vite.lib.config.ts,
// vite.standalone.config.ts and vite.webcomponent.config.ts.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-demo',
  },
})
