import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initOneSignal } from './utils/oneSignal'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize OneSignal after the app mounts
if (typeof window !== 'undefined') {
  initOneSignal();
}
