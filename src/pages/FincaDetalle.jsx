import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Heart,
  Images,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { FINCAS, AMENIDADES } from '../data/fincas.js'
import { formatoPesos, linkWhatsApp } from '../data/config.js'
import { ICONO_AMENIDAD, IconoWhatsApp } from '../components/Iconos.jsx'
import Foto from '../components/Foto.jsx'
import FincaCard from '../components/FincaCard.jsx'
import NoEncontrada from './NoEncontrada.jsx'
import useFavoritas from '../hooks/useFavoritas.js'

const sumarDias = (iso, dias) => {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

function Galeria({ fotos, nombre }) {
  const [abierta, setAbierta] = useState(null)
  const total = fotos.length

  useEffect(() => {
    if (abierta === null) return
    const teclas = (e) => {
      if (e.key === 'Escape') setAbierta(null)
      if (e.key === 'ArrowRight') setAbierta((i) => (i + 1) % total)
      if (e.key === 'ArrowLeft') setAbierta((i) => (i - 1 + total) % total)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', teclas)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', teclas)
    }
  }, [abierta, total])

  return (
    <>
      <div className="galeria">
        {fotos.map((src, i) => (
          <button key={src + i} className={`galeria__item galeria__item--${i}`} onClick={() => setAbierta(i)}>
            <Foto src={src} alt={`${nombre}, foto ${i + 1} de ${total}`} />
          </button>
        ))}
        <button className="galeria__todas" onClick={() => setAbierta(0)}>
          <Images size={16} /> Ver las {total} fotos
        </button>
      </div>

      {abierta !== null && (
        <div className="visor" role="dialog" aria-modal="true" aria-label={`Fotos de ${nombre}`} onClick={() => setAbierta(null)}>
          <button className="visor__cerrar" aria-label="Cerrar" onClick={() => setAbierta(null)} autoFocus>
            <X size={26} />
          </button>
          <button
            className="visor__flecha visor__flecha--izq"
            aria-label="Foto anterior"
            onClick={(e) => {
              e.stopPropagation()
              setAbierta((i) => (i - 1 + total) % total)
            }}
          >
            <ChevronLeft size={30} />
          </button>
          <figure className="visor__foto" onClick={(e) => e.stopPropagation()}>
            <Foto src={fotos[abierta]} alt={`${nombre}, foto ${abierta + 1} de ${total}`} />
            <figcaption>
              {abierta + 1} de {total}
            </figcaption>
          </figure>
          <button
            className="visor__flecha visor__flecha--der"
            aria-label="Foto siguiente"
            onClick={(e) => {
              e.stopPropagation()
              setAbierta((i) => (i + 1) % total)
            }}
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </>
  )
}

function Reserva({ finca }) {
  const hoy = new Date().toISOString().slice(0, 10)
  const [llegada, setLlegada] = useState('')
  const [salida, setSalida] = useState('')
  const [personas, setPersonas] = useState(Math.min(8, finca.capacidad))

  const noches = useMemo(() => {
    if (!llegada || !salida) return 0
    const n = Math.round((new Date(salida) - new Date(llegada)) / 86400000)
    return n > 0 ? n : 0
  }, [llegada, salida])

  const fechasInvalidas = llegada && salida && noches === 0
  const total = noches * finca.precio

  const mensaje = [
    `Hola, quiero reservar *${finca.nombre}* (${finca.ubicacion}).`,
    llegada ? `Llegada: ${llegada}` : null,
    salida ? `Salida: ${salida}` : null,
    `Personas: ${personas}`,
    noches && finca.precio ? `Total estimado: ${formatoPesos(total)} por ${noches} ${noches === 1 ? 'noche' : 'noches'}` : null,
    '¿Está disponible?',
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <aside className="reserva" aria-label="Reservar">
      <p className="reserva__precio">
        {finca.precio ? (
          <>
            <strong>{formatoPesos(finca.precio)}</strong> la noche
          </>
        ) : (
          <strong>Precio a consultar</strong>
        )}
      </p>
      <div className="reserva__fechas">
        <label>
          <span>Llegada</span>
          <input
            type="date"
            min={hoy}
            value={llegada}
            onChange={(e) => {
              setLlegada(e.target.value)
              if (!salida || salida <= e.target.value) setSalida(sumarDias(e.target.value, 2))
            }}
          />
        </label>
        <label>
          <span>Salida</span>
          <input type="date" min={llegada ? sumarDias(llegada, 1) : hoy} value={salida} onChange={(e) => setSalida(e.target.value)} />
        </label>
      </div>
      <label className="reserva__personas">
        <span>Personas</span>
        <select value={personas} onChange={(e) => setPersonas(Number(e.target.value))}>
          {Array.from({ length: finca.capacidad }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'persona' : 'personas'}
            </option>
          ))}
        </select>
      </label>

      {fechasInvalidas && <p className="reserva__aviso">La salida debe ser después de la llegada.</p>}

      {noches > 0 && finca.precio > 0 && (
        <dl className="reserva__resumen">
          <div>
            <dt>
              {formatoPesos(finca.precio)} × {noches} {noches === 1 ? 'noche' : 'noches'}
            </dt>
            <dd>{formatoPesos(total)}</dd>
          </div>
          <div>
            <dt>Para separar (50 %)</dt>
            <dd>{formatoPesos(total / 2)}</dd>
          </div>
        </dl>
      )}

      <a className="boton boton--verde boton--ancho" href={linkWhatsApp(mensaje)} target="_blank" rel="noreferrer">
        <IconoWhatsApp size={20} />
        Consultar disponibilidad
      </a>
      <p className="reserva__nota">Te respondemos por WhatsApp. Aún no se hace ningún cobro.</p>
    </aside>
  )
}

export default function FincaDetalle() {
  const { id } = useParams()
  const finca = FINCAS.find((f) => f.id === id)
  const [favoritas, alternarFavorita] = useFavoritas()

  useEffect(() => {
    if (finca) document.title = `${finca.nombre} · Findea`
    return () => {
      document.title = 'Findea · Alquiler de fincas y quintas en Colombia'
    }
  }, [finca])

  if (!finca) return <NoEncontrada />

  const favorita = favoritas.includes(finca.id)
  const similares = FINCAS.filter((f) => f.id !== finca.id && (f.destino === finca.destino || f.tipo === finca.tipo)).slice(0, 3)

  return (
    <div className="detalle">
      <div className="contenedor">
        <Link to="/#fincas" className="volver">
          <ChevronLeft size={18} /> Todas las fincas
        </Link>

        <div className="detalle__cabeza">
          <div>
            <h1 className="detalle__titulo">{finca.nombre}</h1>
            <p className="detalle__meta">
              <span>
                <Star size={16} fill="currentColor" className="estrella" /> {finca.resenas > 0 ? `${finca.calificacion.toString().replace('.', ',')} (${finca.resenas} reseñas)` : 'Nueva en FINDEA'}
              </span>
              <span>
                <MapPin size={16} /> {finca.ubicacion}
              </span>
            </p>
          </div>
          <button
            className={`boton boton--borde ${favorita ? 'boton--fav' : ''}`}
            onClick={() => alternarFavorita(finca.id)}
            aria-pressed={favorita}
          >
            <Heart size={18} fill={favorita ? 'currentColor' : 'none'} />
            {favorita ? 'Guardada' : 'Guardar'}
          </button>
        </div>

        <Galeria fotos={finca.fotos} nombre={finca.nombre} />

        <div className="detalle__cuerpo">
          <div className="detalle__info">
            <ul className="detalle__datos">
              <li>
                <Users size={22} />
                <span>
                  <strong>Hasta {finca.capacidad}</strong> personas
                </span>
              </li>
              <li>
                <BedDouble size={22} />
                <span>
                  <strong>{finca.habitaciones || '—'}</strong> habitaciones
                </span>
              </li>
              <li>
                <Bath size={22} />
                <span>
                  <strong>{finca.banos || '—'}</strong> baños
                </span>
              </li>
            </ul>

            <h2 className="detalle__subtitulo">Sobre la {finca.tipo.toLowerCase()}</h2>
            <p className="detalle__descripcion">{finca.descripcion}</p>

            <h2 className="detalle__subtitulo">Qué incluye</h2>
            <ul className="detalle__amenidades">
              {finca.amenidades.map((a) => {
                const Icono = ICONO_AMENIDAD[a]
                return (
                  <li key={a}>
                    <Icono size={20} /> {AMENIDADES[a]}
                  </li>
                )
              })}
            </ul>

            <h2 className="detalle__subtitulo">Antes de llegar</h2>
            <ul className="detalle__reglas">
              <li>
                <Clock size={18} /> Entrada desde las 3:00 p. m., salida hasta la 1:00 p. m.
              </li>
              <li>
                <ShieldCheck size={18} /> Depósito reembolsable por daños, se devuelve al entregar la casa.
              </li>
            </ul>
          </div>
          <Reserva finca={finca} />
        </div>

        {similares.length > 0 && (
          <section className="detalle__similares">
            <h2 className="seccion__titulo">También te pueden gustar</h2>
            <div className="rejilla">
              {similares.map((f) => (
                <FincaCard key={f.id} finca={f} favorita={favoritas.includes(f.id)} onFavorito={alternarFavorita} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
