import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import Proviecontext from './context/Proviecontext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
   <Proviecontext>
      <SocketContextProvider>
           <App />
      </SocketContextProvider>
 </Proviecontext>
   </BrowserRouter>
 
  
 
  
 
  
)
