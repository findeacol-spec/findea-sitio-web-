import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, Volume2, VolumeX } from 'lucide-react'
import { EXPERIENCIAS } from './datos.js'
import CapituloVideo from './CapituloVideo.jsx'
import s from './ExperienciasMeta.module.css'

gsap.registerPlugin(ScrollTrigger)

const TITULO = 'Descubre las experiencias del Meta'

// Línea de tiempo (en "tiempos"; el scroll la recorre de principio a fin)
const T = {
  inicio: 0.15, //        pequeña pausa con las tarjetas a la vista
  abrir: 1, //            la tarjeta del centro se abre a pantalla completa
  cambio: 1.9, //         primer cambio de experiencia
  porCapitulo: 1.6, //    cada experiencia dura esto
  transicion: 1,
  final: 0.8,
}
const DURACION = T.cambio + (EXPERIENCIAS.length - 1) * T.porCapitulo + T.final

// Puesto de cada experiencia en la fila de tarjetas (0 = extremo izquierdo).
// La primera va en el centro porque es la que se abre; las demás se reparten
// a la derecha y a la izquierda.
const N = EXPERIENCIAS.length
const CENTRO = Math.floor((N - 1) / 2)
const PUESTOS = EXPERIENCIAS.map((_, i) => CENTRO + (i % 2 ? 1 : -1) * Math.ceil(i / 2))

const irAFincas = () => document.getElementById('fincas')?.scrollIntoView({ behavior: 'smooth' })
const limitar = (v, min, max) => Math.min(max, Math.max(min, v))

function capituloEn(tiempo) {
  if (tiempo < T.cambio + 0.5) return 0
  return Math.min(EXPERIENCIAS.length - 1, Math.floor((tiempo - T.cambio - 0.5) / T.porCapitulo) + 1)
}

// Medidas de las tarjetas según la pantalla. Cada experiencia es una capa a
// pantalla completa recortada con forma de tarjeta; para que el video quede
// centrado dentro de la tarjeta, se achica y se mueve su contenido.
function geometria(movil) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const base = movil ? Math.min(vw * 0.5, 260) : Math.min(vw * 0.17, 280)
  const G = movil ? 12 : 18
  const cy = vh * 0.62
  // La del centro un poco más grande y las de los lados un poco más pequeñas
  const factor = [1.1, 0.93, 0.86]
  const anchos = [...Array(N).keys()].map((k) => base * factor[Math.min(2, Math.abs(k - CENTRO))])
  const centros = Array(N).fill(vw / 2)
  for (let k = CENTRO + 1; k < N; k++) centros[k] = centros[k - 1] + anchos[k - 1] / 2 + G + anchos[k] / 2
  for (let k = CENTRO - 1; k >= 0; k--) centros[k] = centros[k + 1] - anchos[k + 1] / 2 - G - anchos[k] / 2
  const px = (n) => `${Math.max(0, Math.round(n))}px`
  const recorte = (cx, W, H, dx = 0) =>
    `inset(${px(cy - H / 2)} ${px(vw - (cx + dx + W / 2))} ${px(vh - (cy + H / 2))} ${px(cx + dx - W / 2)} round 22px)`

  const tarjetas = EXPERIENCIAS.map((exp, i) => {
    const puesto = PUESTOS[i]
    const W = anchos[puesto]
    const H = W * 1.42
    const cx = centros[puesto]
    // Zona de la capa que debe quedar dentro de la tarjeta
    let F = { x: 0, y: 0, w: vw, h: vh }
    if (exp.vertical && !movil) {
      const ph = Math.min(vh * 0.8, 760)
      const pw = (ph * 9) / 16
      const der = limitar(vw * 0.08, 24, 140)
      F = { x: vw - der - pw, y: (vh - ph) / 2, w: pw, h: ph }
    }
    const escala = Math.max(W / F.w, H / F.h)
    const x = cx - (vw / 2 + escala * (F.x + F.w / 2 - vw / 2))
    const y = cy - (vh / 2 + escala * (F.y + F.h / 2 - vh / 2))
    const salida = Math.sign(puesto - CENTRO) * vw * 0.6
    return { cx, cy, W, H, x, y, escala, salida, recorte: recorte(cx, W, H), recorteFuera: recorte(cx, W, H, salida) }
  })
  return { tarjetas }
}

export default function ExperienciasMeta() {
  const raiz = useRef(null)
  const escenario = useRef(null)
  const actual = useRef(-1)
  const [activo, setActivo] = useState(-1)
  const [sonido, setSonido] = useState(false)
  const [entorno] = useState(() => ({
    quieta: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    movil: window.matchMedia('(max-width: 767px)').matches,
  }))
  const { quieta, movil } = entorno

  const cambiarActivo = (c) => {
    if (c !== actual.current) {
      actual.current = c
      setActivo(c)
    }
  }

  // ------------------------------------------------------------------
  // Animación con GSAP + ScrollTrigger
  // ------------------------------------------------------------------
  useLayoutEffect(() => {
    if (quieta) return
    let geo = geometria(movil)

    // Etiquetas con el nombre de cada experiencia, debajo de su tarjeta
    const ubicarEtiquetas = () => {
      raiz.current?.querySelectorAll('[data-etiqueta]').forEach((el) => {
        const t = geo.tarjetas[Number(el.dataset.etiqueta)]
        el.style.left = `${t.cx - t.W / 2}px`
        el.style.top = `${t.cy + t.H / 2 - 12}px`
        el.style.width = `${t.W}px`
      })
    }
    const alRefrescar = () => {
      geo = geometria(movil)
      ubicarEtiquetas()
    }
    ubicarEtiquetas()
    ScrollTrigger.addEventListener('refreshInit', alRefrescar)

    const ctx = gsap.context(() => {
      // Al llegar: el título y las tarjetas suben en cascada sobre el mismo
      // fondo claro de la sección de fincas.
      const orden = [...EXPERIENCIAS.keys()].sort((a, b) => PUESTOS[a] - PUESTOS[b])
      const entrada = gsap
        .timeline({ paused: true })
        .from('[data-palabra]', { opacity: 0, yPercent: 70, duration: 0.7, stagger: 0.06, ease: 'power3.out' })
        .from('[data-bajada]', { opacity: 0, y: 14, duration: 0.6, ease: 'power2.out' }, 0.35)
        .from(
          orden.map((i) => `[data-capa="${i}"]`),
          { y: 90, duration: 0.9, stagger: 0.07, ease: 'power3.out' },
          0.15,
        )
        .from('[data-etiqueta]', { opacity: 0, y: 16, duration: 0.6, stagger: 0.05, ease: 'power2.out' }, 0.45)
      ScrollTrigger.create({
        trigger: raiz.current,
        start: 'top 65%',
        end: 'bottom top',
        onEnter: () => {
          entrada.play()
          cambiarActivo(0)
        },
        onEnterBack: () => cambiarActivo(capituloEn(tl.time())),
        onLeave: () => cambiarActivo(-1),
        onLeaveBack: () => {
          entrada.reverse()
          cambiarActivo(-1)
        },
      })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: escenario.current,
          start: 'top top',
          end: () => '+=' + Math.round(DURACION * window.innerHeight * (movil ? 0.5 : 0.6)),
          pin: true,
          scrub: movil ? 0.4 : 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => cambiarActivo(capituloEn(tl.time())),
        },
      })

      // --- 1. Las tarjetas: la del centro se abre, las demás se apartan ---
      EXPERIENCIAS.forEach((_, i) => {
        const capa = `[data-capa="${i}"]`
        const medio = `${capa} [data-medio]`
        if (i === 0) {
          tl.fromTo(
            capa,
            { clipPath: () => geo.tarjetas[0].recorte },
            { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: T.abrir, ease: 'power3.inOut' },
            T.inicio,
          )
          tl.fromTo(
            medio,
            { x: () => geo.tarjetas[0].x, y: () => geo.tarjetas[0].y, scale: () => geo.tarjetas[0].escala },
            { x: 0, y: 0, scale: 1, duration: T.abrir, ease: 'power3.inOut' },
            T.inicio,
          )
        } else {
          tl.fromTo(
            capa,
            { clipPath: () => geo.tarjetas[i].recorte, autoAlpha: 1 },
            { clipPath: () => geo.tarjetas[i].recorteFuera, autoAlpha: 0, duration: T.abrir * 0.8, ease: 'power2.in' },
            T.inicio,
          )
          tl.fromTo(
            medio,
            { x: () => geo.tarjetas[i].x, y: () => geo.tarjetas[i].y, scale: () => geo.tarjetas[i].escala },
            { x: () => geo.tarjetas[i].x + geo.tarjetas[i].salida, duration: T.abrir * 0.8, ease: 'power2.in' },
            T.inicio,
          )
        }
      })
      // (el contenedor, para no chocar con la entrada que anima cada etiqueta)
      tl.to('[data-etiquetas]', { autoAlpha: 0, duration: 0.25 }, T.inicio)
      tl.to('[data-intro]', { autoAlpha: 0, y: -40, duration: 0.45, ease: 'power2.in' }, T.inicio)
      // Mientras la tarjeta se abre, el fondo claro pasa a oscuro (queda detrás
      // de los videos durante los cambios de experiencia)
      tl.fromTo('[data-fondo]', { opacity: 0 }, { opacity: 1, duration: T.abrir * 0.8 }, T.inicio + 0.1)
      tl.to('[data-pista]', { autoAlpha: 0, duration: 0.25 }, T.inicio)

      const textoListo = T.inicio + T.abrir * 0.75
      tl.from(
        '[data-texto="0"] [data-linea]',
        { opacity: 0, y: 34, duration: 0.5, stagger: 0.07, ease: 'power3.out' },
        textoListo,
      )
      tl.to(['[data-progreso]', '[data-sonido]'], { opacity: 1, duration: 0.3 }, textoListo)
      tl.fromTo('[data-barra="0"]', { scaleX: 0 }, { scaleX: 1, duration: T.cambio + 0.5 - textoListo }, textoListo)

      // --- 2. Una experiencia tras otra ---
      for (let i = 1; i < EXPERIENCIAS.length; i++) {
        const t = T.cambio + (i - 1) * T.porCapitulo
        const previo = `[data-capa="${i - 1}"]`
        const siguiente = `[data-capa="${i}"]`
        if (i === 1) {
          // De la primera a la segunda: la siguiente sube desde abajo
          tl.set(siguiente, { autoAlpha: 1 }, t)
          tl.set(`${siguiente} [data-medio]`, { x: 0, y: 0, scale: 1.25, yPercent: 6 }, t)
          tl.to(`[data-texto="${i - 1}"] [data-linea]`, { opacity: 0, y: -24, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, t)
          tl.to(previo, { scale: 0.9, borderRadius: 28, duration: T.transicion, ease: 'power2.inOut' }, t)
          tl.to(`${previo} [data-velo]`, { opacity: 0.7, duration: T.transicion }, t)
          tl.fromTo(
            siguiente,
            { clipPath: 'inset(100% 0% 0% 0% round 28px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: T.transicion, ease: 'power3.inOut', immediateRender: false },
            t + 0.05,
          )
          tl.to(`${siguiente} [data-medio]`, { scale: 1, yPercent: 0, duration: T.transicion + 0.25, ease: 'power2.out' }, t + 0.05)
          tl.from(
            `[data-texto="${i}"] [data-linea]`,
            { opacity: 0, y: 34, duration: 0.5, stagger: 0.07, ease: 'power3.out' },
            t + 0.6,
          )
        } else {
          // De la segunda en adelante: la siguiente entra desde la derecha y
          // la anterior se va hacia la izquierda
          tl.set(siguiente, { autoAlpha: 1, xPercent: 100 }, t)
          tl.set(`${siguiente} [data-medio]`, { x: 0, y: 0, scale: 1.08, xPercent: 18 }, t)
          tl.to(`[data-texto="${i - 1}"] [data-linea]`, { opacity: 0, x: -50, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, t)
          tl.to(previo, { xPercent: -35, scale: 0.92, borderRadius: 28, duration: T.transicion, ease: 'power2.inOut' }, t)
          tl.to(`${previo} [data-velo]`, { opacity: 0.75, duration: T.transicion }, t)
          tl.to(siguiente, { xPercent: 0, duration: T.transicion, ease: 'power3.inOut' }, t)
          tl.fromTo(
            siguiente,
            { clipPath: 'inset(0% 0% 0% 0% round 28px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: T.transicion, ease: 'power4.in', immediateRender: false },
            t,
          )
          tl.to(`${siguiente} [data-medio]`, { scale: 1, xPercent: 0, duration: T.transicion + 0.2, ease: 'power2.out' }, t)
          tl.from(
            `[data-texto="${i}"] [data-linea]`,
            { opacity: 0, x: 60, duration: 0.5, stagger: 0.07, ease: 'power3.out' },
            t + 0.6,
          )
        }
        const fin = i === EXPERIENCIAS.length - 1 ? DURACION : t + T.porCapitulo + 0.5
        tl.fromTo(`[data-barra="${i}"]`, { scaleX: 0 }, { scaleX: 1, duration: fin - (t + 0.5) }, t + 0.5)
      }
      tl.to({}, { duration: 0.001 }, DURACION)
    }, raiz)

    // Si cambia el alto de lo que está arriba (filtros del catálogo, fotos
    // que terminan de cargar…), se recalculan las posiciones del scroll.
    let alto = document.body.scrollHeight
    let espera = 0
    const ro = new ResizeObserver(() => {
      const nuevo = document.body.scrollHeight
      if (Math.abs(nuevo - alto) < 2) return
      alto = nuevo
      clearTimeout(espera)
      espera = setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    ro.observe(document.body)

    return () => {
      ro.disconnect()
      clearTimeout(espera)
      ScrollTrigger.removeEventListener('refreshInit', alRefrescar)
      ctx.revert()
    }
  }, [quieta, movil])

  // ------------------------------------------------------------------
  // Versión sin animación (si el usuario pidió reducir movimiento)
  // ------------------------------------------------------------------
  if (quieta) return <VersionQuieta movil={movil} />

  const palabras = TITULO.split(' ')

  return (
    <section ref={raiz} className={s.seccion} id="experiencias" aria-label={TITULO}>
      <div ref={escenario} className={s.escenario}>
        <div className={s.fondo} data-fondo />

        {EXPERIENCIAS.map((exp, i) => (
          <CapituloVideo
            key={exp.id}
            exp={exp}
            indice={i}
            movil={movil}
            activo={activo === i}
            sonido={sonido}
            cargar={activo === -1 ? i === 0 : Math.abs(activo - i) <= 1}
          />
        ))}

        <div data-etiquetas aria-hidden="true">
          {EXPERIENCIAS.map((exp, i) => (
            <p key={exp.id} className={s.etiqueta} data-etiqueta={i}>
              {exp.titulo}
            </p>
          ))}
        </div>

        <div className={s.intro} data-intro>
          <h2 className={s.titulo}>
            {palabras.map((p, i) => (
              <Fragment key={i}>
                <span className={s.palabraCaja}>
                  <span className={s.palabra} data-palabra>
                    {p}
                  </span>
                </span>
                {i < palabras.length - 1 && ' '}
              </Fragment>
            ))}
          </h2>
          <p className={s.bajada} data-bajada>
            Sabana, fogón y joropo a pocos minutos de tu finca.
          </p>
        </div>

        <p className={s.pista} data-pista>
          Desliza para entrar <ChevronDown size={16} aria-hidden="true" />
        </p>

        {EXPERIENCIAS.map((exp, i) => (
          <div key={exp.id} className={s.texto} data-texto={i}>
            <h3 className={s.capTitulo} data-linea>
              {exp.titulo}
            </h3>
            <p className={s.capTexto} data-linea>
              {exp.texto}
            </p>
            {i === EXPERIENCIAS.length - 1 && (
              <button type="button" className={s.boton} onClick={irAFincas} data-linea>
                Elegir mi finca
              </button>
            )}
          </div>
        ))}

        <div className={s.progreso} data-progreso aria-hidden="true">
          {EXPERIENCIAS.map((exp, i) => (
            <span key={exp.id} className={s.pasoBarra}>
              <span className={s.relleno} data-barra={i} />
            </span>
          ))}
        </div>

        <button
          type="button"
          className={s.sonido}
          data-sonido
          onClick={() => setSonido((v) => !v)}
          aria-pressed={sonido}
          disabled={activo < 0}
        >
          {sonido ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>{sonido ? 'Silenciar' : 'Activar sonido'}</span>
        </button>
      </div>
    </section>
  )
}

// Sin pin ni scroll: título y las cinco experiencias una debajo de otra.
function VersionQuieta({ movil }) {
  const [visible, setVisible] = useState(-1)
  const lista = useRef(null)
  useEffect(() => {
    const capas = lista.current?.querySelectorAll('[data-capitulo]') ?? []
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setVisible(Number(e.target.dataset.capitulo))
        })
      },
      { threshold: 0.6 },
    )
    capas.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])
  return (
    <section className={s.seccionQuieta} id="experiencias" aria-label={TITULO}>
      <h2 className={s.tituloQuieto}>{TITULO}</h2>
      <div ref={lista} className={s.listaQuieta}>
        {EXPERIENCIAS.map((exp, i) => (
          <article key={exp.id} className={s.capituloQuieto} data-capitulo={i}>
            <CapituloVideo
              exp={exp}
              indice={i}
              movil={movil}
              activo={visible === i}
              cargar={Math.abs(visible - i) <= 1 || i === 0}
              fijo
            />
            <div className={s.textoQuieto}>
              <h3 className={s.capTitulo}>{exp.titulo}</h3>
              <p className={s.capTexto}>{exp.texto}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
