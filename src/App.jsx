import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFlotante from './components/WhatsAppFlotante.jsx'
import Inicio from './pages/Inicio.jsx'
import FincaDetalle from './pages/FincaDetalle.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'

function ScrollArriba() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollArriba />
      <Header />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/finca/:id" element={<FincaDetalle />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFlotante />
    </>
  )
}
