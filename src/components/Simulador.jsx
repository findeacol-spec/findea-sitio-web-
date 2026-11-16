import { useEffect, useRef, useState } from 'react'
import { Calculator, X } from 'lucide-react'
import { formatoPesos } from '../data/config.js'

// Simulador de precio y comisión de cada finca (se abre en una ventana emergente)
const soloDigitos = (texto) => texto.replace(/\D/g, '')
const conPuntos = (digitos) => (digitos ? Number(digitos).toLocaleString('es-CO') : '')

function CampoPesos({ etiqueta, valor, onCambio, ayuda }) {
  return (
    <label className="simulador__campo">
      <span className="simulador__etiqueta">{etiqueta}</span>
      <span className="simulador__entrada simulador__entrada--pesos">
        <span aria-hidden="true">$</span>
        <input
          inputMode="numeric"
          value={conPuntos(valor)}
          onChange={(e) => onCambio(soloDigitos(e.target.value))}
          placeholder="0"
        />
      </span>
      {ayuda && <span className="simulador__ayuda">{ayuda}</span>}
    </label>
  )
}

function CampoNumero({ etiqueta, valor, onCambio, sufijo }) {
  return (
    <label className="simulador__campo">
      <span className="simulador__etiqueta">{etiqueta}</span>
      <span className="simulador__entrada">
        <input
          inputMode="decimal"
          value={valor}
          onChange={(e) => onCambio(e.target.value.replace(/[^\d.,]/g, ''))}
          placeholder="0"
        />
        {sufijo && <span aria-hidden="true">{sufijo}</span>}
      </span>
    </label>
  )
}

export default function Simulador({ finca }) {
  const [abierto, setAbierto] = useState(false)
  const [personas, setPersonas] = useState(String(finca.capacidad))
  const [noches, setNoches] = useState('1')
  const [propietario, setPropietario] = useState(String(finca.precio))
  const [porcentaje, setPorcentaje] = useState('15')
  const [cobrado, setCobrado] = useState('')
  const cerrarRef = useRef(null)

  useEffect(() => {
    if (!abierto) return
    const teclas = (e) => e.key === 'Escape' && setAbierto(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', teclas)
    cerrarRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', teclas)
    }
  }, [abierto])

  const nPersonas = Number(personas) || 0
  const nNoches = Number(noches) || 0
  const vPropietario = Number(propietario) || 0
  const pct = Number(String(porcentaje).replace(',', '.')) || 0
  const vCobrado = Number(cobrado) || 0
  const hayCobro = vCobrado > 0

  const porPersona = hayCobro && nPersonas > 0 ? Math.round(vCobrado / nPersonas) : null
  const comisionPorcentaje = Math.round((vPropietario * pct) / 100)
  const diferencia = hayCobro ? vCobrado - vPropietario : null
  const comisionNoche = hayCobro ? comisionPorcentaje + diferencia : null
  const comisionTotal = comisionNoche !== null ? comisionNoche * nNoches : null

  const mostrar = (v) => (v === null ? '—' : formatoPesos(v))

  return (
    <>
      <button className="boton boton--borde" onClick={() => setAbierto(true)}>
        <Calculator size={18} />
        Simulador
      </button>

      {abierto && (
        <div className="simulador__fondo" onClick={() => setAbierto(false)}>
          <div
            className="simulador"
            role="dialog"
            aria-modal="true"
            aria-labelledby="simulador-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="simulador__cabeza">
              <div>
                <h2 className="simulador__titulo" id="simulador-titulo">
                  Simulador
                </h2>
                <p className="simulador__finca">{finca.nombre}</p>
              </div>
              <button className="simulador__cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar simulador" ref={cerrarRef}>
                <X size={20} />
              </button>
            </div>

            <div className="simulador__campos">
              <CampoNumero etiqueta="Cantidad de personas" valor={personas} onCambio={setPersonas} />
              <CampoNumero etiqueta="Cantidad de noches" valor={noches} onCambio={setNoches} />
              <CampoPesos etiqueta="Valor propietario por noche" valor={propietario} onCambio={setPropietario} />
              <CampoNumero etiqueta="Comisión sobre el propietario" valor={porcentaje} onCambio={setPorcentaje} sufijo="%" />
              <div className="simulador__ancho">
                <CampoPesos
                  etiqueta="Valor que cobramos al cliente por noche"
                  valor={cobrado}
                  onCambio={setCobrado}
                />
              </div>
            </div>

            <h3 className="simulador__subtitulo">Para el cliente</h3>
            <dl className="simulador__tabla">
              <div>
                <dt>Valor que cobramos por noche</dt>
                <dd>{mostrar(hayCobro ? vCobrado : null)}</dd>
              </div>
              <div>
                <dt>Personas</dt>
                <dd>{nPersonas || '—'}</dd>
              </div>
              <div className="simulador__total">
                <dt>Valor por noche por persona</dt>
                <dd>{mostrar(porPersona)}</dd>
              </div>
            </dl>

            <h3 className="simulador__subtitulo">Comisión</h3>
            <dl className="simulador__tabla">
              <div>
                <dt>Comisión del {pct.toLocaleString('es-CO')} % sobre el propietario</dt>
                <dd>{formatoPesos(comisionPorcentaje)}</dd>
              </div>
              <div>
                <dt>Diferencia (cobrado menos propietario)</dt>
                <dd className={diferencia !== null && diferencia < 0 ? 'simulador__negativo' : ''}>{mostrar(diferencia)}</dd>
              </div>
              <div className="simulador__total">
                <dt>Comisión por noche</dt>
                <dd>{mostrar(comisionNoche)}</dd>
              </div>
              <div className="simulador__total simulador__total--fuerte">
                <dt>
                  Comisión total ({nNoches} {nNoches === 1 ? 'noche' : 'noches'})
                </dt>
                <dd>{mostrar(comisionTotal)}</dd>
              </div>
            </dl>

            {!hayCobro && <p className="simulador__aviso">Escribe el valor que cobramos al cliente para ver los resultados.</p>}
            {diferencia !== null && diferencia < 0 && (
              <p className="simulador__aviso simulador__aviso--alerta">
                El valor que cobramos es menor que el del propietario.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
