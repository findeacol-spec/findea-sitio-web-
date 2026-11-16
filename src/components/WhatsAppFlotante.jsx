import { linkWhatsApp } from '../data/config.js'
import { IconoWhatsApp } from './Iconos.jsx'

export default function WhatsAppFlotante() {
  return (
    <a
      className="wa-flotante"
      href={linkWhatsApp('Hola, quiero alquilar una finca. ¿Me ayudan?')}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <IconoWhatsApp size={28} />
    </a>
  )
}
