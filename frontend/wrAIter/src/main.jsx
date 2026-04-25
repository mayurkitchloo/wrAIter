import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position='bottom-right'
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#1a1a2e',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.08)',
              padding: '12px 16px',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif",
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
