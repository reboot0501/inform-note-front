import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'froala-editor/css/froala_style.min.css'
import './styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
