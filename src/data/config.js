// Cambia estos datos por los reales de tu negocio
export const MARCA = {
  nombre: 'Findea',
  lema: 'Fincas y quintas para descansar en grande',
  // Número de WhatsApp con indicativo de país, sin + ni espacios
  whatsapp: '573000000000',
  correo: 'reservas@findea.co',
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/',
  facebook: 'https://facebook.com/',
}

export function linkWhatsApp(mensaje) {
  return `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(mensaje)}`
}

export function formatoPesos(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor)
}
