import { useState } from 'react'

// Imagen con respaldo: si la foto no carga, muestra un fondo verde con textura
export default function Foto({ src, alt, className = '', ...props }) {
  const [fallo, setFallo] = useState(false)
  if (fallo || !src) {
    return <div className={`foto-respaldo ${className}`} role="img" aria-label={alt} />
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setFallo(true)}
      {...props}
    />
  )
}
