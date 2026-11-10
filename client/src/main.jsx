import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3200,
              style: {
                borderRadius: '12px',
                background: '#0f172a',
                color: '#f8fafc',
                fontSize: '13px',
                fontWeight: 600,
                padding: '10px 14px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#ffffff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
            }}
          />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
