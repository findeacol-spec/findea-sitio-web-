import { Link } from 'react-router-dom'
import { Heart, Star, Users, BedDouble, MapPin } from 'lucide-react'
import { AMENIDADES } from '../data/fincas.js'
import { formatoPesos } from '../data/config.js'
import { ICONO_AMENIDAD } from './Iconos.jsx'
import Foto from './Foto.jsx'

export default function FincaCard({ finca, favorita, onFavorito }) {
  const principales = finca.amenidades.slice(0, 4)
  return (
    <article className="tarjeta">
      <div className="tarjeta__foto">
        <Link to={`/finca/${finca.id}`} tabIndex={-1} aria-hidden="true">
          <Foto src={finca.fotos[0]} alt="" />
        </Link>
        <span className="tarjeta__tipo">{finca.tipo}</span>
        <button
          className={`tarjeta__fav ${favorita ? 'tarjeta__fav--activo' : ''}`}
          onClick={() => onFavorito(finca.id)}
          aria-pressed={favorita}
          aria-label={favorita ? `Quitar ${finca.nombre} de favoritas` : `Guardar ${finca.nombre} en favoritas`}
        >
          <Heart size={18} fill={favorita ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="tarjeta__cuerpo">
        <div className="tarjeta__fila">
          <h3 className="tarjeta__nombre">
            <Link to={`/finca/${finca.id}`}>{finca.nombre}</Link>
          </h3>
          <span className="tarjeta__nota">
            <Star size={14} fill="currentColor" className="estrella" />
            {finca.resenas > 0 ? finca.calificacion.toString().replace('.', ',') : 'Nueva'}
          </span>
        </div>
        <p className="tarjeta__lugar">
          <MapPin size={14} /> {finca.ubicacion}
        </p>
        <ul className="tarjeta__datos">
          <li>
            <Users size={15} /> Hasta {finca.capacidad}
          </li>
          {finca.habitaciones > 0 && (
            <li>
              <BedDouble size={15} /> {finca.habitaciones} habitaciones
            </li>
          )}
        </ul>
        <ul className="tarjeta__amenidades" aria-label="Comodidades">
          {principales.map((a) => {
            const Icono = ICONO_AMENIDAD[a]
            return (
              <li key={a} title={AMENIDADES[a]}>
                <Icono size={16} />
                <span className="sr-only">{AMENIDADES[a]}</span>
              </li>
            )
          })}
          {finca.amenidades.length > 4 && <li className="tarjeta__mas">+{finca.amenidades.length - 4}</li>}
        </ul>
        <p className="tarjeta__precio">
          {finca.precio ? (
            <>
              <strong>{formatoPesos(finca.precio)}</strong> la noche
            </>
          ) : (
            <strong>Precio a consultar</strong>
          )}
        </p>
      </div>
    </article>
  )
}
