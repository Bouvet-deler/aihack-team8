import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import App from './App.tsx'

// Load EDS font stylesheet asynchronously (non-render-blocking)
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href = 'https://cdn.eds.equinor.com/font/eds-uprights-vf.css'
document.head.appendChild(fontLink)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
