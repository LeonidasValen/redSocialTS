import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/authContext.tsx'
import { AdminProvider } from './context/adminContent.tsx'
import { PostProvider } from './context/postContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <PostProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </PostProvider>
    </AuthProvider>
  </React.StrictMode>,
)
