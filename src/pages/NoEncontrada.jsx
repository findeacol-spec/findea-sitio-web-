import { Link } from 'react-router-dom'

export default function NoEncontrada() {
  return (
    <section className="seccion pagina-corta">
      <div className="contenedor vacio">
        <p className="vacio__titulo">Esta página no existe o la finca ya no está publicada.</p>
        <Link className="boton boton--verde" to="/#fincas">
          Ver fincas disponibles
        </Link>
      </div>
    </section>
  )
}
