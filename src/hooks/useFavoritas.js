import { useEffect, useState } from 'react'

const CLAVE = 'findea-favoritas'

function leer() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || []
  } catch {
    return []
  }
}

export default function useFavoritas() {
  const [favoritas, setFavoritas] = useState(leer)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(favoritas))
    } catch {
      /* el navegador no permite guardar; seguimos en memoria */
    }
  }, [favoritas])

  const alternar = (id) =>
    setFavoritas((lista) => (lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]))

  return [favoritas, alternar]
}
