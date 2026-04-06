import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { FamilyProvider } from './contexts/FamilyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FamilyProvider>
        <App />
      </FamilyProvider>
    </AuthProvider>
  </StrictMode>,
)
