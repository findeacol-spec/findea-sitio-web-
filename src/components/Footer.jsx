import { MARCA } from '../data/config.js'
import { IconoInstagram, IconoTikTok, IconoFacebook } from './Iconos.jsx'
import { Logo } from './Header.jsx'

// Pie de página en tres bloques: redes a la izquierda, logo en la mitad y texto a la derecha
export default function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer__fila">
        <div className="footer__redes">
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

        <Logo claro />

        <p className="footer__texto">
          Fincas y quintas para descansar en grande. Fincas revisadas una por una en cinco regiones de Colombia.
        </p>
      </div>
      <p className="contenedor footer__legal">
        © {new Date().getFullYear()} {MARCA.nombre}. Todos los derechos reservados.
      </p>
    </footer>
  )
}
