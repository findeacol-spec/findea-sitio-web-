import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Volume2, VolumeX } from 'lucide-react'

// Escena de experiencias: mientras el usuario baja, un mico desciende por una liana
// sosteniendo un marco en forma de arco; al final el marco se abre y muestra el video.
// Pon tu video en public/videos/experiencia.mp4 (horizontal, 15 a 30 segundos).
const VIDEO_PROPIO = '/videos/experiencia.mp4'
const VIDEO_RESPALDO = 'https://assets.mixkit.co/videos/8640/8640-720.mp4'

const limitar = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))
const mezclar = (a, b, t) => a + (b - a) * t
const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Medidas del dibujo (unidades del viewBox 200 x 260; la mano de arriba está en x = 100)
const MARCO = { x: 40, y: 166, ancho: 160, alto: 200 }

function Mico() {
  const crema = '#e9dccd'
  return (
    <svg viewBox="0 0 200 260" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path className="experiencia__cola" d="M80 154 C50 162 34 196 46 222 C56 242 82 238 80 220 C79 210 68 210 66 218" strokeWidth="5.5" />
        <path d="M86 156 C78 172 74 182 70 196" strokeWidth="8.5" />
        <path d="M104 158 C110 174 114 184 118 196" strokeWidth="8.5" />
      </g>
      <ellipse cx="69" cy="199" rx="7.5" ry="4.2" fill="currentColor" />
      <ellipse cx="120" cy="199" rx="7.5" ry="4.2" fill="currentColor" />
      <ellipse cx="94" cy="132" rx="21" ry="31" fill="currentColor" transform="rotate(-8 94 132)" />
      <ellipse cx="97" cy="136" rx="11.5" ry="19" fill={crema} transform="rotate(-8 97 136)" />
      <g stroke="currentColor" strokeLinecap="round">
        <path d="M100 8 C104 30 102 50 96 70" strokeWidth="9" />
        <path d="M106 112 C122 128 128 146 126 168" strokeWidth="8" />
      </g>
      <circle cx="100" cy="7" r="6.5" fill="currentColor" />
      <circle cx="126" cy="170" r="5.8" fill="currentColor" />
      <circle cx="58" cy="80" r="8.5" fill="currentColor" />
      <circle cx="58" cy="80" r="4.4" fill={crema} />
      <circle cx="106" cy="78" r="8.5" fill="currentColor" />
      <circle cx="106" cy="78" r="4.4" fill={crema} />
      <circle cx="82" cy="80" r="23" fill="currentColor" />
      <circle cx="76.5" cy="79" r="7.4" fill={crema} />
      <circle cx="90.5" cy="79" r="7.4" fill={crema} />
      <ellipse cx="83.5" cy="89" rx="12.5" ry="9.5" fill={crema} />
      <circle className="experiencia__ojo" cx="77" cy="80" r="2.6" fill="currentColor" />
      <circle className="experiencia__ojo" cx="90" cy="80" r="2.6" fill="currentColor" />
      <circle cx="82" cy="88" r="1" fill="currentColor" />
      <circle cx="85.5" cy="88" r="1" fill="currentColor" />
      <path d="M79 93 Q83.5 96.5 88 93" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function Hojas() {
  return (
    <svg viewBox="0 0 120 50" aria-hidden="true">
      <path d="M0 6 C30 10 80 2 120 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M58 6 C46 16 40 30 44 42 C54 34 60 20 58 6Z" fill="currentColor" />
      <path d="M62 6 C74 14 84 26 82 38 C70 32 62 20 62 6Z" fill="var(--piscina)" opacity="0.85" />
      <path d="M30 8 C22 18 20 28 24 36 C32 28 34 18 30 8Z" fill="currentColor" opacity="0.8" />
      <path d="M92 6 C100 14 104 22 102 30 C94 26 90 16 92 6Z" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

function VideoExperiencia({ videoRef }) {
  const alFallar = (e) => {
    const v = e.currentTarget
    if (!v.src.endsWith(VIDEO_RESPALDO)) {
      v.src = VIDEO_RESPALDO
      v.load()
    }
  }
  return (
    <video
      ref={videoRef}
      className="experiencia__video"
      src={VIDEO_PROPIO}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      onError={alFallar}
    />
  )
}

function BotonSonido({ videoRef }) {
  const [sonido, setSonido] = useState(false)
  const alternar = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = sonido
    if (!sonido) v.play().catch(() => {})
    setSonido(!sonido)
  }
  return (
    <button className="experiencia__sonido" onClick={alternar} aria-pressed={sonido}>
      {sonido ? <Volume2 size={16} /> : <VolumeX size={16} />}
      {sonido ? 'Silenciar' : 'Activar sonido'}
    </button>
  )
}

export default function Experiencia() {
  const seccion = useRef(null)
  const pendulo = useRef(null)
  const liana = useRef(null)
  const colgante = useRef(null)
  const mico = useRef(null)
  const marco = useRef(null)
  const texto = useRef(null)
  const video = useRef(null)
  const [abierto, setAbierto] = useState(false)
  const [quieta] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  // Animación guiada por el scroll (sin librerías)
  useEffect(() => {
    if (quieta) return
    let cuadro = 0

    const pintar = () => {
      cuadro = 0
      const s = seccion.current
      if (!s || !pendulo.current) return
      const caja = s.getBoundingClientRect()
      const vh = window.innerHeight
      const vw = s.clientWidth
      const p = limitar(-caja.top / (caja.height - vh))
      const movil = vw < 760
      const esc = movil ? 0.72 : 1 // tamaño del mico (200 px de ancho en computador)
      const x = movil ? vw * 0.5 : vw * 0.66

      // Fase 1: el mico baja columpiándose
      const t1 = limitar(p / 0.42)
      const yFin = (movil ? vh * 0.4 : vh * 0.5) - (MARCO.y + MARCO.alto / 2) * esc
      const y = mezclar(-(MARCO.y + MARCO.alto + 60) * esc, yFin, suave(t1))
      const angulo = 9 * Math.sin(t1 * Math.PI * 3) * (1 - t1)

      // Fase 2: el marco se abre y el mico sube por la liana
      const t2 = limitar((p - 0.48) / 0.36)
      const a2 = suave(t2)

      pendulo.current.style.transform = `translateX(${x}px) rotate(${angulo}deg)`
      liana.current.style.height = `${Math.max(0, y) + 6}px`
      liana.current.style.opacity = String(1 - limitar(t2 * 1.8))
      colgante.current.style.transform = `translateY(${y}px)`
      mico.current.style.transform = `translateY(${-a2 * (y + 420)}px)`
      mico.current.style.opacity = String(1 - limitar(t2 * 1.6))

      const w0 = MARCO.ancho * esc
      const h0 = MARCO.alto * esc
      const l0 = (MARCO.x - 100) * esc
      const top0 = MARCO.y * esc
      const W = movil ? vw * 0.9 : Math.min(1120, vw * 0.8)
      const H = movil ? Math.min(vh * 0.62, W * 1.25) : Math.min(vh * 0.74, (W * 9) / 16)
      const w = mezclar(w0, W, a2)
      const h = mezclar(h0, H, a2)
      const m = marco.current.style
      m.width = `${w}px`
      m.height = `${h}px`
      m.left = `${mezclar(l0, vw / 2 - x - W / 2, a2)}px`
      m.top = `${mezclar(top0, (vh - H) / 2 - y, a2)}px`
      const rx = mezclar(w0 / 2, 28, a2)
      const ry = mezclar(h0 * 0.4, 28, a2)
      const rb = mezclar(14, 28, a2)
      m.borderRadius = `${rx}px ${rx}px ${rb}px ${rb}px / ${ry}px ${ry}px ${rb}px ${rb}px`

      const aparece = limitar((p - 0.02) / 0.16)
      const desaparece = limitar(t2 * 2.2)
      texto.current.style.opacity = String(aparece * (1 - desaparece))
      texto.current.style.transform = `translateY(${(1 - aparece) * 24}px) translateX(${-desaparece * 40}px)`

      setAbierto(t2 > 0.97)
    }

    const alMover = () => {
      if (!cuadro) cuadro = requestAnimationFrame(pintar)
    }
    pintar()
    window.addEventListener('scroll', alMover, { passive: true })
    window.addEventListener('resize', alMover)
    return () => {
      cancelAnimationFrame(cuadro)
      window.removeEventListener('scroll', alMover)
      window.removeEventListener('resize', alMover)
    }
  }, [quieta])

  // El video solo se reproduce mientras la sección está en pantalla
  useEffect(() => {
    const v = video.current
    const s = seccion.current
    if (!v || !s) return
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.05 }
    )
    observador.observe(s)
    return () => observador.disconnect()
  }, [])

  if (quieta) {
    return (
      <section className="experiencia experiencia--quieta" ref={seccion} aria-label="Video de experiencias">
        <div className="contenedor">
          <p className="experiencia__antetitulo">Experiencias Findea</p>
          <h2 className="experiencia__titulo">Así se vive una finca Findea</h2>
          <div className="experiencia__marco-quieto">
            <VideoExperiencia videoRef={video} />
            <BotonSonido videoRef={video} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="experiencia" ref={seccion} aria-label="Video de experiencias">
      <div className="experiencia__escena">
        <div className="experiencia__texto-caja">
          <div className="experiencia__texto" ref={texto}>
            <p className="experiencia__antetitulo">Experiencias Findea</p>
            <h2 className="experiencia__titulo">Así se vive una finca Findea</h2>
            <p className="experiencia__pista">
              Sigue bajando <ChevronDown size={16} />
            </p>
          </div>
        </div>

        <div className="experiencia__pendulo" ref={pendulo}>
          <div className="experiencia__hojas">
            <Hojas />
          </div>
          <div className="experiencia__liana" ref={liana} />
          <div className="experiencia__colgante" ref={colgante}>
            <div className={`experiencia__marco ${abierto ? 'experiencia__marco--abierto' : ''}`} ref={marco}>
              <VideoExperiencia videoRef={video} />
              {abierto && <BotonSonido videoRef={video} />}
            </div>
            <div className="experiencia__mico" ref={mico}>
              <Mico />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
