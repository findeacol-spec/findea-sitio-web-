import { useMemo } from 'react'
import { SlidersHorizontal, Heart } from 'lucide-react'
import { FINCAS, DESTINOS, AMENIDADES } from '../data/fincas.js'
import { ICONO_AMENIDAD } from './Iconos.jsx'
import FincaCard from './FincaCard.jsx'

const FILTRO_AMENIDADES = ['piscina', 'jacuzzi', 'mascotas', 'aire', 'rio', 'cancha']

export const FILTROS_INICIALES = {
  destino: '',
  tipo: '',
  personas: 0,
  amenidades: [],
  orden: 'recomendadas',
  soloFavoritas: false,
}

export default function Catalogo({ filtros, setFiltros, favoritas, onFavorito }) {
  const cambiar = (campo, valor) => setFiltros((f) => ({ ...f, [campo]: valor }))
  const alternarAmenidad = (a) =>
    setFiltros((f) => ({
      ...f,
      amenidades: f.amenidades.includes(a) ? f.amenidades.filter((x) => x !== a) : [...f.amenidades, a],
    }))

  const resultado = useMemo(() => {
    let lista = FINCAS.filter(
      (f) =>
        (!filtros.destino || f.destino === filtros.destino) &&
        (!filtros.tipo || f.tipo === filtros.tipo) &&
        f.capacidad >= filtros.personas &&
        filtros.amenidades.every((a) => f.amenidades.includes(a)) &&
        (!filtros.soloFavoritas || favoritas.includes(f.id))
    )
    if (filtros.orden === 'menor') lista = [...lista].sort((a, b) => a.precio - b.precio)
    if (filtros.orden === 'mayor') lista = [...lista].sort((a, b) => b.precio - a.precio)
    if (filtros.orden === 'capacidad') lista = [...lista].sort((a, b) => b.capacidad - a.capacidad)
    if (filtros.orden === 'recomendadas')
      lista = [...lista].sort((a, b) => Number(b.destacada) - Number(a.destacada) || b.calificacion - a.calificacion)
    return lista
  }, [filtros, favoritas])

  const destinoActivo = DESTINOS.find((d) => d.id === filtros.destino)

  return (
    <section className="seccion seccion--niebla" id="fincas">
      <div className="contenedor">
        <div className="seccion__cabeza seccion__cabeza--fila">
          <div>
            <h2 className="seccion__titulo">
              {destinoActivo ? `Fincas en ${destinoActivo.nombre}` : 'Fincas y quintas disponibles'}
            </h2>
            <p className="seccion__bajada" aria-live="polite">
              {resultado.length} {resultado.length === 1 ? 'opción encontrada' : 'opciones encontradas'}
            </p>
          </div>
          <label className="orden">
            <span>Ordenar por</span>
            <select value={filtros.orden} onChange={(e) => cambiar('orden', e.target.value)}>
              <option value="recomendadas">Recomendadas</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
              <option value="capacidad">Más capacidad</option>
            </select>
          </label>
        </div>

        <div className="filtros" role="group" aria-label="Filtros">
          <SlidersHorizontal size={18} className="filtros__icono" aria-hidden="true" />
          <div className="segmentado" role="radiogroup" aria-label="Tipo de alojamiento">
            {[
              ['', 'Todas'],
              ['Finca', 'Fincas'],
              ['Quinta', 'Quintas'],
            ].map(([valor, texto]) => (
              <button
                key={texto}
                role="radio"
                aria-checked={filtros.tipo === valor}
                className={filtros.tipo === valor ? 'activo' : ''}
                onClick={() => cambiar('tipo', valor)}
              >
                {texto}
              </button>
            ))}
          </div>
          <select
            className="filtros__select"
            value={filtros.destino}
            onChange={(e) => cambiar('destino', e.target.value)}
            aria-label="Destino"
          >
            <option value="">Todos los destinos</option>
            {DESTINOS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
          <select
            className="filtros__select"
            value={filtros.personas}
            onChange={(e) => cambiar('personas', Number(e.target.value))}
            aria-label="Número de personas"
          >
            <option value={0}>Cualquier grupo</option>
            {[6, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n} personas o más
              </option>
            ))}
          </select>
          {FILTRO_AMENIDADES.map((a) => {
            const Icono = ICONO_AMENIDAD[a]
            const activo = filtros.amenidades.includes(a)
            return (
              <button
                key={a}
                className={`chip ${activo ? 'chip--activo' : ''}`}
                aria-pressed={activo}
                onClick={() => alternarAmenidad(a)}
              >
                <Icono size={15} /> {AMENIDADES[a]}
              </button>
            )
          })}
          <button
            className={`chip ${filtros.soloFavoritas ? 'chip--activo' : ''}`}
            aria-pressed={filtros.soloFavoritas}
            onClick={() => cambiar('soloFavoritas', !filtros.soloFavoritas)}
          >
            <Heart size={15} /> Mis favoritas ({favoritas.length})
          </button>
        </div>

        {resultado.length > 0 ? (
          <div className="rejilla">
            {resultado.map((f) => (
              <FincaCard key={f.id} finca={f} favorita={favoritas.includes(f.id)} onFavorito={onFavorito} />
            ))}
          </div>
        ) : (
          <div className="vacio">
            <p className="vacio__titulo">Ninguna finca cumple todos esos filtros.</p>
            <p>Quita alguno o escríbenos por WhatsApp y te buscamos una a la medida.</p>
            <button className="boton boton--borde" onClick={() => setFiltros(FILTROS_INICIALES)}>
              Quitar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
