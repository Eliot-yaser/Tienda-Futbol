import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { BrowserRouter, HashRouter } from 'react-router-dom'

// En desarrollo seguimos usando rutas como /admin y /carrito.
// En GitHub Pages usamos #/admin y #/carrito para que
// los enlaces internos funcionen al recargar una página.
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
