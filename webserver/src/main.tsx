import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AuthContextProvider } from './hooks/auth'
import App from './router'

import './assets/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </StrictMode>,
)
