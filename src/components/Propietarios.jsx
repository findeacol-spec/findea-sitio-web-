import { Check } from 'lucide-react'
import { linkWhatsApp } from '../data/config.js'
import { IconoWhatsApp } from './Iconos.jsx'
import Foto from './Foto.jsx'

export default function Propietarios() {
  return (
    <section className="seccion" id="propietarios">
      <div className="contenedor propietarios">
        <div className="propietarios__foto">
          <Foto
            src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=75"
            alt="Piscina de una finca vista desde el corredor"
          />
        </div>
        <div className="propietarios__texto">
          <h2 className="seccion__titulo">¿Tienes una finca que pasa vacía entre semana?</h2>
          <p className="seccion__bajada">
            La publicamos, tomamos las fotos y atendemos a los clientes. Tú solo decides qué fechas abrir.
          </p>
          <ul className="lista-check">
            <li>
              <Check size={18} /> Sin costo de publicación
            </li>
            <li>
              <Check size={18} /> Revisamos a cada huésped antes de confirmar
            </li>
            <li>
              <Check size={18} /> Recibes el pago antes de cada estadía
            </li>
          </ul>
          <a
            className="boton boton--verde"
            href={linkWhatsApp('Hola, tengo una finca y quiero publicarla con ustedes.')}
            target="_blank"
            rel="noreferrer"
          >
            <IconoWhatsApp size={18} />
            Publicar mi finca
          </a>
        </div>
      </div>
    </section>
  )
}
