import { useState } from 'react'
import { Star } from 'lucide-react'
import { OPINIONES, FINCAS } from '../data/fincas.js'
import Foto from './Foto.jsx'

// Foto de la persona con borde ondulado; si no carga, muestra sus iniciales
function Retrato({ src, nombre }) {
  const [fallo, setFallo] = useState(false)
  const iniciales = nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return (
    <span className="testimonio__retrato" aria-hidden="true">
      {fallo ? (
        <span className="testimonio__iniciales">{iniciales}</span>
      ) : (
        <img src={src} alt="" loading="lazy" onError={() => setFallo(true)} />
      )}
    </span>
  )
}

function Tarjeta({ opinion, oculta }) {
  return (
    <figure className="testimonio" aria-hidden={oculta || undefined}>
      <Retrato src={opinion.foto} nombre={opinion.nombre} />
      <figcaption className="testimonio__cabeza">
        <span className="testimonio__nombre">{opinion.nombre}</span>
        <span className="testimonio__estrellas" aria-label="5 de 5 estrellas">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={17} fill="currentColor" strokeWidth={0} />
          ))}
        </span>
      </figcaption>
      <blockquote className="testimonio__texto">{opinion.texto}</blockquote>
    </figure>
  )
}

export default function Opiniones() {
  // Se repite la lista para que el desfile sea continuo, sin cortes
  const tanda = [...OPINIONES, ...OPINIONES]

  return (
    <section className="testimonios">
      <Foto className="testimonios__fondo" src={(FINCAS[2] ?? FINCAS[0])?.fotos[0]} alt="" />
      <div className="testimonios__velo" aria-hidden="true" />

      <div className="contenedor testimonios__cabeza">
        <h2 className="seccion__titulo">Lo que cuentan quienes ya fueron</h2>
      </div>

      <div className="testimonios__ventana">
        <div className="testimonios__pista">
          {[0, 1].map((copia) =>
            tanda.map((o, i) => <Tarjeta key={`${copia}-${i}`} opinion={o} oculta={copia === 1 || i >= OPINIONES.length} />)
          )}
        </div>
      </div>
    </section>
  )
}
