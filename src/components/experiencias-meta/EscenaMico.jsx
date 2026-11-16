import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import s from './ExperienciasMeta.module.css'

// El mico, sincronizado con el scroll.
// - Con fotogramas (definitivo): se dibujan en un <canvas>, cuadro por cuadro,
//   como en las páginas de producto de Apple. Se cargan de forma progresiva:
//   primero el primero, luego uno de cada 8, de cada 4… así nunca hay huecos.
// - Sin fotogramas (provisional): se adelanta y atrasa un <video>.
const EscenaMico = forwardRef(function EscenaMico({ config, movil }, ref) {
  const lienzo = useRef(null)
  const video = useRef(null)
  const imagenes = useRef([])
  const progreso = useRef(0)
  const pendiente = useRef(0)
  const { total } = config.fotogramas
  const conFotogramas = total > 0

  // ---- Dibujo de un fotograma en el lienzo (ajuste tipo "cover") ----
  const dibujar = () => {
    pendiente.current = 0
    if (conFotogramas) {
      const c = lienzo.current
      if (!c || !c.width) return
      const objetivo = Math.round(progreso.current * (total - 1))
      let img = null
      for (let d = 0; d < total && !img; d++) {
        for (const k of [objetivo - d, objetivo + d]) {
          const candidata = imagenes.current[k]
          if (candidata && candidata.complete && candidata.naturalWidth) {
            img = candidata
            break
          }
        }
      }
      if (!img) return
      const ctx = c.getContext('2d')
      const r = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight)
      const w = img.naturalWidth * r
      const h = img.naturalHeight * r
      ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h)
    } else {
      const v = video.current
      if (!v || !v.duration || v.seeking) return
      const t = progreso.current * (v.duration - 0.06)
      if (Math.abs(v.currentTime - t) > 0.03) v.currentTime = t
    }
  }

  const pedirDibujo = () => {
    if (!pendiente.current) pendiente.current = requestAnimationFrame(dibujar)
  }

  useImperativeHandle(ref, () => ({
    actualizar(p) {
      progreso.current = p
      pedirDibujo()
    },
  }))

  // ---- Carga progresiva de los fotogramas ----
  useEffect(() => {
    if (!conFotogramas) return
    const carpeta = movil ? config.fotogramas.movil : config.fotogramas.escritorio
    const ruta = (i) => `${carpeta}${String(i + 1).padStart(4, '0')}.${config.fotogramas.extension}`
    const orden = []
    const vistos = new Set()
    for (const paso of [total, 8, 4, 2, 1]) {
      for (let i = 0; i < total; i += paso) {
        if (!vistos.has(i)) {
          vistos.add(i)
          orden.push(i)
        }
      }
    }
    let cancelado = false
    let siguiente = 0
    const cargarUno = () => {
      if (cancelado || siguiente >= orden.length) return
      const i = orden[siguiente++]
      const img = new Image()
      img.decoding = 'async'
      img.onload = img.onerror = () => {
        pedirDibujo()
        cargarUno()
      }
      img.src = ruta(i)
      imagenes.current[i] = img
    }
    // 6 descargas en paralelo
    for (let k = 0; k < 6; k++) cargarUno()
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conFotogramas, movil, total])

  // ---- Tamaño del lienzo según la pantalla ----
  useEffect(() => {
    const c = lienzo.current
    if (!c) return
    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, movil ? 1.5 : 2)
      c.width = Math.round(c.clientWidth * dpr)
      c.height = Math.round(c.clientHeight * dpr)
      pedirDibujo()
    }
    const ro = new ResizeObserver(ajustar)
    ro.observe(c)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movil])

  useEffect(() => () => cancelAnimationFrame(pendiente.current), [])

  if (conFotogramas) return <canvas ref={lienzo} className={s.micoMedio} aria-hidden="true" />

  return (
    <video
      ref={video}
      className={s.micoMedio}
      src={config.videoProvisional}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      onLoadedMetadata={pedirDibujo}
      onSeeked={pedirDibujo}
    />
  )
})

export default EscenaMico
