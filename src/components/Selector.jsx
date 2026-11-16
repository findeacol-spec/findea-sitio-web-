import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

// Lista desplegable con el estilo de la página (reemplaza el <select> del navegador)
export default function Selector({ icono: Icono, etiqueta, valor, opciones, onCambio }) {
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(0)
  const caja = useRef(null)
  const id = useId()
  const indiceElegido = Math.max(0, opciones.findIndex((o) => o.valor === valor))
  const elegida = opciones[indiceElegido]

  useEffect(() => {
    if (!abierto) return
    setActivo(indiceElegido)
    const fuera = (e) => {
      if (caja.current && !caja.current.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [abierto, indiceElegido])

  const elegir = (o) => {
    onCambio(o.valor)
    setAbierto(false)
  }

  const teclas = (e) => {
    if (e.key === 'Escape') return setAbierto(false)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!abierto) return setAbierto(true)
      const paso = e.key === 'ArrowDown' ? 1 : -1
      setActivo((i) => (i + paso + opciones.length) % opciones.length)
    }
    if ((e.key === 'Enter' || e.key === ' ') && abierto) {
      e.preventDefault()
      elegir(opciones[activo])
    }
  }

  return (
    <div className={`selector ${abierto ? 'selector--abierto' : ''}`} ref={caja}>
      <button
        type="button"
        className="selector__boton"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={`${id}-lista`}
        onClick={() => setAbierto((v) => !v)}
        onKeyDown={teclas}
      >
        <span className="buscador__etiqueta">
          {Icono && <Icono size={16} />} {etiqueta}
        </span>
        <span className="selector__valor">
          {elegida?.texto}
          <ChevronDown size={18} className="selector__flecha" aria-hidden="true" />
        </span>
      </button>

      {abierto && (
        <ul className="selector__lista" role="listbox" id={`${id}-lista`} aria-label={etiqueta}>
          {opciones.map((o, i) => {
            const esElegida = o.valor === valor
            return (
              <li
                key={String(o.valor)}
                role="option"
                aria-selected={esElegida}
                className={`selector__opcion ${i === activo ? 'selector__opcion--activa' : ''} ${esElegida ? 'selector__opcion--elegida' : ''}`}
                onMouseEnter={() => setActivo(i)}
                onClick={() => elegir(o)}
              >
                <span className="selector__texto">{o.texto}</span>
                <span className="selector__radio" aria-hidden="true" />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
