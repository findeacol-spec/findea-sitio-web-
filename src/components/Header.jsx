import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { MARCA, linkWhatsApp } from '../data/config.js'

// Logo de Findea (versión blanca sobre la foto y el pie; verde sobre fondo claro)
export function Logo({ claro = false }) {
  return (
    <Link to="/" className="logo" aria-label={`${MARCA.nombre}, ir al inicio`}>
      <img
        className="logo__img"
        src={claro ? '/logo-findea-blanco.png' : '/logo-findea-verde.png'}
        alt={MARCA.nombre}
        width="479"
        height="589"
      />
    </Link>
  )
}

const IZQUIERDA = [
  { href: '/#fincas', texto: 'Fincas' },
  { href: '/#destinos', texto: 'Destinos' },
  { href: '/#como-reservar', texto: 'Cómo reservar' },
]

const DERECHA = [
  { href: '/#propietarios', texto: 'Sé aliado' },
  { href: linkWhatsApp('Hola, quiero reservar una finca.'), texto: 'Invierte', externo: true },
]

function Enlace({ href, texto, externo, onClick }) {
  if (externo) {
    return (
      <a href={href} target="_blank" rel="noreferrer" onClick={onClick}>
        {texto}
      </a>
    )
  }
  return (
    <Link to={href} onClick={onClick}>
      {texto}
    </Link>
  )
}

export default function Header() {
  const [abierto, setAbierto] = useState(false)
  const [conFondo, setConFondo] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const alDesplazar = () => setConFondo(window.scrollY > 24)
    alDesplazar()
    window.addEventListener('scroll', alDesplazar, { passive: true })
    return () => window.removeEventListener('scroll', alDesplazar)
  }, [])

  useEffect(() => setAbierto(false), [pathname])

  const cerrar = () => setAbierto(false)
  // En la portada, mientras no se haya bajado, el encabezado va en blanco sobre la foto
  const sobreFoto = pathname === '/' && !conFondo && !abierto

  return (
    <header className={`header ${sobreFoto ? 'header--foto' : 'header--fondo'}`}>
      <div className="contenedor header__fila">
        <button
          className="nav__toggle"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          onClick={() => setAbierto((v) => !v)}
        >
          {abierto ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="nav nav--izq" aria-label="Principal">
          {IZQUIERDA.map((e) => (
            <Enlace key={e.texto} {...e} />
          ))}
        </nav>

        <Logo claro={sobreFoto} />

        <nav className="nav nav--der" aria-label="Secundaria">
          {DERECHA.map((e) => (
            <Enlace key={e.texto} {...e} />
          ))}
        </nav>
      </div>

      <nav id="menu-movil" className={`menu-movil ${abierto ? 'menu-movil--abierto' : ''}`} aria-label="Menú">
        {[...IZQUIERDA, ...DERECHA].map((e) => (
          <Enlace key={e.texto} {...e} onClick={cerrar} />
        ))}
      </nav>
    </header>
  )
}
