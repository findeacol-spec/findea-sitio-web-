import { FINCAS } from './fincas.js'

// Carga las fincas registradas en el panel administrativo (Supabase).
// Con la conexión configurada se muestran SOLO las fincas reales publicadas
// (las de ejemplo se quitan). Sin conexión configurada (.env vacío), se ven
// las de ejemplo, útil para diseñar.
const URL = import.meta.env.VITE_SUPABASE_URL
const LLAVE = import.meta.env.VITE_SUPABASE_KEY

const urlFoto = (ruta) =>
  !ruta ? '' : ruta.startsWith('http') ? ruta : `${URL}/storage/v1/object/public/fincas/${ruta}`

function convertir(f) {
  const fotos = (f.fotos || []).map(urlFoto).filter(Boolean)
  return {
    id: f.slug || f.id,
    nombre: f.nombre,
    tipo: f.tipo || 'Finca',
    destino: f.destino || 'meta',
    ubicacion: f.ubicacion || '',
    precio: Number(f.precio_noche) || 0, // 0 = precio a consultar
    capacidad: f.capacidad,
    habitaciones: f.habitaciones || 0,
    banos: f.banos || 0,
    calificacion: 0,
    resenas: 0,
    destacada: Boolean(f.destacada),
    amenidades: f.amenidades || [],
    descripcion: f.descripcion || '',
    fotos: fotos.length ? fotos : [''], // sin fotos se muestra el fondo verde de respaldo
  }
}

export async function cargarFincasRemotas() {
  if (!URL || !LLAVE) return false
  FINCAS.splice(0, FINCAS.length) // nada de fincas de ejemplo en la página real
  try {
    const control = new AbortController()
    const espera = setTimeout(() => control.abort(), 5000)
    const res = await fetch(`${URL}/rest/v1/v_fincas_web?select=*&order=destacada.desc,created_at.desc`, {
      headers: { apikey: LLAVE, Authorization: `Bearer ${LLAVE}` },
      signal: control.signal,
    })
    clearTimeout(espera)
    if (!res.ok) return false
    const datos = await res.json()
    if (!Array.isArray(datos)) return false
    FINCAS.splice(0, FINCAS.length, ...datos.map(convertir))
    return true
  } catch {
    return false
  }
}
