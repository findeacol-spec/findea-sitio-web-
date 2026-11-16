import { DESTINOS, FINCAS } from '../data/fincas.js'
import Foto from './Foto.jsx'

export default function Destinos({ activo, onElegir }) {
  return (
    <section className="seccion" id="destinos">
      <div className="contenedor">
        <div className="seccion__cabeza">
          <h2 className="seccion__titulo">¿Calor de llano o frío de montaña?</h2>
          <p className="seccion__bajada">Elige la región y te mostramos las fincas disponibles allá.</p>
        </div>
        <ul className="destinos">
          {DESTINOS.map((d) => {
            const total = FINCAS.filter((f) => f.destino === d.id).length
            const seleccionado = activo === d.id
            return (
              <li key={d.id}>
                <button
                  className={`destino ${seleccionado ? 'destino--activo' : ''}`}
                  onClick={() => onElegir(seleccionado ? '' : d.id)}
                  aria-pressed={seleccionado}
                >
                  <span className="destino__arco">
                    <Foto src={d.imagen} alt="" />
                  </span>
                  <span className="destino__nombre">{d.nombre}</span>
                  <span className="destino__info">
                    {d.region}, {total} {total === 1 ? 'finca' : 'fincas'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
