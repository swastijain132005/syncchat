import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {AuthProvider} from '../context/Authcontext.jsx'
import {ChatProvider} from '../context/Chatcontext.jsx'
import {AIProvider} from '../context/AIcontext.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
     <AIProvider>
      <ChatProvider>
        <App />
        </ChatProvider>
        </AIProvider>
    </AuthProvider>
  </BrowserRouter>
)
    
