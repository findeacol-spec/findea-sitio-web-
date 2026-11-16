import { useEffect, useRef } from 'react'

// Video de portada: montaje de varias casas quintas con fundidos entre tomas.
// Clips gratuitos de Mixkit (licencia libre para uso comercial).
const CLIPS = [
  { src: 'https://assets.mixkit.co/videos/47286/47286-720.mp4', desde: 0, dura: 6 }, // villa con jardín y piscina
  { src: 'https://assets.mixkit.co/videos/8179/8179-720.mp4', desde: 2, dura: 6 }, // quinta con piscina desde el aire
  { src: 'https://assets.mixkit.co/videos/8639/8639-720.mp4', desde: 10, dura: 6 }, // casa campestre con piscina
  { src: 'https://assets.mixkit.co/videos/8171/8171-720.mp4', desde: 4, dura: 6 }, // conjunto de fincas
  { src: 'https://assets.mixkit.co/videos/27540/27540-720.mp4', desde: 3, dura: 6 }, // casa tropical entre palmas
  { src: 'https://assets.mixkit.co/videos/8640/8640-720.mp4', desde: 25, dura: 7 }, // finca al atardecer
]
const FUNDIDO = 1400 // ms, igual que la transición en styles.css

// En celular (pantalla vertical) va el video propio de FINDEA, que es vertical.
const VIDEO_MOVIL = '/videos/portada-movil-v2.mp4'
const esVertical = () => window.matchMedia('(max-width: 767px), (max-aspect-ratio: 4/5)').matches

export default function VideoPortada() {
  const a = useRef(null)
  const b = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (esVertical()) {
      const v = a.current
      v.loop = true
      v.src = VIDEO_MOVIL
      v.play()
        .then(() => v.classList.add('activo'))
        .catch(() => v.classList.add('activo'))
      const alVolverMovil = () => {
        if (document.visibilityState === 'visible') v.play().catch(() => {})
      }
      document.addEventListener('visibilitychange', alVolverMovil)
      return () => {
        document.removeEventListener('visibilitychange', alVolverMovil)
        v.pause()
      }
    }

    const videos = [a.current, b.current]
    let indice = 0
    let capa = 0
    let vivo = true
    let reloj
    let pausa

    const cargar = (video, clip) =>
      new Promise((listo) => {
        const alCargar = () => {
          video.removeEventListener('loadedmetadata', alCargar)
          video.currentTime = clip.desde
          listo(true)
        }
        video.addEventListener('loadedmetadata', alCargar)
        video.addEventListener('error', () => listo(false), { once: true })
        video.src = clip.src
        video.load()
      })

    const mostrar = async () => {
      const actual = videos[capa]
      const anterior = videos[1 - capa]
      try {
        await actual.play()
      } catch {
        /* si el navegador bloquea la reproducción, se queda la foto */
      }
      if (!vivo) return
      actual.classList.add('activo')
      anterior.classList.remove('activo')
      clearTimeout(pausa)
      pausa = setTimeout(() => anterior.pause(), FUNDIDO + 200)

      const siguiente = (indice + 1) % CLIPS.length
      const espera = cargar(anterior, CLIPS[siguiente])
      reloj = setTimeout(async () => {
        await espera
        if (!vivo) return
        indice = siguiente
        capa = 1 - capa
        mostrar()
      }, CLIPS[indice].dura * 1000)
    }

    // Si el usuario cambia de pestaña y vuelve, el video sigue
    const alVolver = () => {
      if (document.visibilityState === 'visible') videos[capa].play().catch(() => {})
    }
    document.addEventListener('visibilitychange', alVolver)

    cargar(videos[0], CLIPS[0]).then(mostrar)
    return () => {
      vivo = false
      document.removeEventListener('visibilitychange', alVolver)
      clearTimeout(reloj)
      clearTimeout(pausa)
      videos.forEach((v) => v.pause())
    }
  }, [])

  return (
    <div className="hero__videos" aria-hidden="true">
      <video ref={a} className="hero__video" muted playsInline preload="auto" disablePictureInPicture />
      <video ref={b} className="hero__video" muted playsInline preload="auto" disablePictureInPicture />
    </div>
  )
}
