import { useEffect, useMemo, useRef, useState } from 'react'
import s from './ExperienciasMeta.module.css'

// Una experiencia a pantalla completa.
// El video solo se descarga cuando el capítulo está cerca (cargar) y solo
// se reproduce cuando está en pantalla (activo). Si el archivo propio no
// existe todavía, pasa al video de respaldo; si tampoco hay, queda el fondo.
export default function CapituloVideo({ exp, indice, activo, cargar, movil, sonido = false, fijo = false }) {
  const video = useRef(null)
  const [cargado, setCargado] = useState(cargar)
  const [fuente, setFuente] = useState(0)
  const [listo, setListo] = useState(false)

  const fuentes = useMemo(
    () => [movil ? exp.videoMovil : null, exp.video, exp.respaldo].filter(Boolean),
    [exp, movil],
  )

  useEffect(() => {
    if (cargar) setCargado(true)
  }, [cargar])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (activo) v.play().catch(() => {})
    else v.pause()
  }, [activo, fuente, cargado])

  // Solo suena el video que está en pantalla, y solo si el usuario lo activó
  useEffect(() => {
    if (video.current) video.current.muted = !(sonido && activo)
  }, [sonido, activo, fuente, cargado])

  const alFallar = () => {
    setListo(false)
    setFuente((f) => f + 1)
  }

  const src = fuentes[fuente]
  // Video vertical en pantalla ancha: panel a la derecha en vez de recortarlo
  const panel = Boolean(exp.vertical && !movil)

  return (
    <div
      className={fijo ? s.capaFija : s.capa}
      data-capa={indice}
      style={{ '--tono-a': exp.tono[0], '--tono-b': exp.tono[1] }}
    >
      <div className={s.medio} data-medio>
        <div className={s.respaldo} />
        {panel && exp.fondo && <img className={s.fondoBorroso} src={exp.fondo} alt="" aria-hidden="true" />}
        {exp.poster && (
          <Panel activo={panel}>
            <img className={s.poster} src={exp.poster} alt="" aria-hidden="true" decoding="async" />
          </Panel>
        )}
        {cargado && src && (
          <Panel activo={panel}>
          <video
            key={src}
            ref={video}
            className={s.video}
            data-listo={listo || undefined}
            src={src}
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            onError={alFallar}
            onLoadedData={() => {
              setListo(true)
              if (activo) video.current?.play().catch(() => {})
            }}
          />
          </Panel>
        )}
      </div>
      <div className={s.sombra} />
      <div className={s.velo} data-velo />
    </div>
  )
}

function Panel({ activo, children }) {
  if (!activo) return children
  return <div className={s.panelVertical}>{children}</div>
}
