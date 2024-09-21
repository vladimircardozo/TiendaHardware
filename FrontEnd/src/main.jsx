import { StrictMode } from 'react'
import "bootstrap-icons/font/bootstrap-icons.css"
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
