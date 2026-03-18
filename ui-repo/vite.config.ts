import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths so the built dist/ can be loaded by the VS Code Webview.
  // Without this, assets start with '/' which doesn't work in vscode-resource:// context.
  base: './',
})
