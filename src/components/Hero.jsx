import { useState } from 'react'
import { MapPin, Users, CalendarDays, Search } from 'lucide-react'
import { DESTINOS, FINCAS } from '../data/fincas.js'
import { MARCA, linkWhatsApp } from '../data/config.js'
import { IconoInstagram, IconoFacebook, IconoTikTok } from './Iconos.jsx'
import Foto from './Foto.jsx'
import VideoPortada from './VideoPortada.jsx'
import Selector from './Selector.jsx'

export default function Hero({ onBuscar }) {
  const [destino, setDestino] = useState('')
  const [fecha, setFecha] = useState('')
  const [personas, setPersonas] = useState('')
  const portada = FINCAS[0]
  const hoy = new Date().toISOString().slice(0, 10)

  const buscar = (e) => {
    e.preventDefault()
    onBuscar({ destino, personas: Number(personas) || 0, fecha })
  }

  const verFincas = () => document.getElementById('fincas')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <section className="hero">
        <Foto className="hero__fondo" src={portada.fotos[0]} alt="" fetchpriority="high" loading="eager" />
        <VideoPortada />
        <div className="hero__velo" aria-hidden="true" />
        <div className="hero__contenido">
          <h1 className="hero__titulo">Descanso en grande</h1>
          <p className="hero__lugar">Fincas y quintas en el corazón de Colombia</p>
          <div className="hero__botones">
            <a
              className="hero__boton hero__boton--borde"
              href={linkWhatsApp('Hola, quiero hacer una consulta sobre sus fincas.')}
              target="_blank"
              rel="noreferrer"
            >
              Consultar
            </a>
            <button className="hero__boton hero__boton--blanco" onClick={verFincas}>
              Reservar ahora
            </button>
          </div>
          <div className="hero__redes">
            <a href={MARCA.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <IconoInstagram />
            </a>
            <a href={MARCA.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <IconoFacebook />
            </a>
            <a href={MARCA.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
              <IconoTikTok />
            </a>
          </div>
        </div>
      </section>

      <div className="contenedor buscador-envoltura">
        <form className="buscador" onSubmit={buscar} role="search">
          <div className="buscador__campo">
            <Selector
              icono={MapPin}
              etiqueta="Destino"
              valor={destino}
              onCambio={setDestino}
              opciones={[
                { valor: '', texto: 'Todos los destinos', detalle: `${FINCAS.length} fincas en Colombia` },
                ...DESTINOS.map((d) => {
                  const total = FINCAS.filter((f) => f.destino === d.id).length
                  return { valor: d.id, texto: d.nombre, detalle: `${d.region}, ${total} ${total === 1 ? 'finca' : 'fincas'}` }
                }),
              ]}
            />
          </div>
          <label className="buscador__campo">
            <span className="buscador__etiqueta">
              <CalendarDays size={16} /> Llegada
            </span>
            <input type="date" min={hoy} value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </label>
          <div className="buscador__campo">
            <Selector
              icono={Users}
              etiqueta="Personas"
              valor={personas}
              onCambio={setPersonas}
              opciones={[
                { valor: '', texto: 'Cualquiera' },
                { valor: '6', texto: '6 o más', detalle: 'Familia o grupo pequeño' },
                { valor: '10', texto: '10 o más', detalle: 'Paseo familiar' },
                { valor: '15', texto: '15 o más', detalle: 'Grupo grande' },
                { valor: '20', texto: '20 o más', detalle: 'Celebraciones y eventos' },
              ]}
            />
          </div>
          <button className="boton boton--verde buscador__boton" type="submit">
            <Search size={18} />
            Buscar fincas
          </button>
        </form>
      </div>
    </>
  )
}
