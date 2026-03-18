import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Surface unhandled errors for webview debugging
window.addEventListener('error', (e) => {
  console.error('[Jira Lens] Unhandled error:', e.error ?? e.message, e.filename, e.lineno, e.colno)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('[Jira Lens] Unhandled rejection:', e.reason)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
