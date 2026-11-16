import { lazy, Suspense, useEffect, useRef, useState } from 'react'

// La sección (y GSAP) se descarga solo cuando el usuario se acerca a ella,
// así la portada y el catálogo cargan igual de rápido que antes.
const ExperienciasMeta = lazy(() => import('./ExperienciasMeta.jsx'))

const Espacio = () => <div style={{ height: '100vh', background: 'var(--niebla)' }} aria-hidden="true" />

export default function ExperienciasDelMeta() {
  const marca = useRef(null)
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    const el = marca.current
    if (!el || !('IntersectionObserver' in window)) {
      setMostrar(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMostrar(true)
          io.disconnect()
        }
      },
      { rootMargin: '1500px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!mostrar) {
    return (
      <div ref={marca}>
        <Espacio />
      </div>
    )
  }
  return (
    <Suspense fallback={<Espacio />}>
      <ExperienciasMeta />
    </Suspense>
  )
}
