import './index.css'
import { initChatbot } from './lib/initChatbot'

// Development/demo harness only — dogfoods the same public API a host
// application would use. Not part of the library build.
const container = document.getElementById('root')
if (!container) {
  throw new Error('#root element not found')
}

initChatbot(container, {
  apiUrl: import.meta.env.VITE_API_URL,
  tenantId: import.meta.env.VITE_TENANT_ID ?? 1,
})
