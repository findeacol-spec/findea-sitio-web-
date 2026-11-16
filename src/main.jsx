import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { cargarFincasRemotas } from './data/fincasRemotas.js'
import './styles.css'

// Primero se traen las fincas del panel administrativo y luego se muestra la página
cargarFincasRemotas().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
})
