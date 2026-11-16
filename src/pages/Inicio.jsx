import { useState } from 'react'
import Hero from '../components/Hero.jsx'
import Catalogo, { FILTROS_INICIALES } from '../components/Catalogo.jsx'
import ComoReservar from '../components/ComoReservar.jsx'
import ExperienciasDelMeta from '../components/experiencias-meta/index.jsx'
import Opiniones from '../components/Opiniones.jsx'
import Propietarios from '../components/Propietarios.jsx'
import useFavoritas from '../hooks/useFavoritas.js'

const irAFincas = () =>
  requestAnimationFrame(() => document.getElementById('fincas')?.scrollIntoView({ behavior: 'smooth' }))

export default function Inicio() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [favoritas, alternarFavorita] = useFavoritas()

  const buscar = ({ destino, personas }) => {
    setFiltros((f) => ({ ...f, destino, personas }))
    irAFincas()
  }

  return (
    <>
      <Hero onBuscar={buscar} />
      <Catalogo filtros={filtros} setFiltros={setFiltros} favoritas={favoritas} onFavorito={alternarFavorita} />
      <ExperienciasDelMeta />
      <ComoReservar />
      <Opiniones />
      <Propietarios />
    </>
  )
}
