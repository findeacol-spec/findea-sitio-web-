import { Search, MessageCircle, KeyRound } from 'lucide-react'

const PASOS = [
  {
    Icono: Search,
    titulo: 'Elige la finca',
    texto: 'Filtra por destino, número de personas y lo que no te puede faltar: piscina, jacuzzi o espacio para las mascotas.',
  },
  {
    Icono: MessageCircle,
    titulo: 'Confirma por WhatsApp',
    texto: 'Te respondemos con disponibilidad, precio final y condiciones. Separas con el 50 %.',
  },
  {
    Icono: KeyRound,
    titulo: 'Llega y descansa',
    texto: 'El encargado te recibe con la casa lista. Pagas el saldo al llegar.',
  },
]

export default function ComoReservar() {
  return (
    <section className="seccion reservar" id="como-reservar">
      <div className="contenedor">
        <div className="reservar__cabeza">
          <h2 className="reservar__titulo">Reservar toma tres pasos</h2>
          <p className="reservar__bajada">Sin pagos en línea, todo por WhatsApp</p>
        </div>
        <ol className="pasos">
          {PASOS.map(({ Icono, titulo, texto }, i) => (
            <li key={titulo} className="paso">
              <span className="paso__circulo" aria-hidden="true">
                <Icono size={28} strokeWidth={1.6} />
              </span>
              <span className="paso__etiqueta">Paso {i + 1}</span>
              <h3 className="paso__titulo">{titulo}</h3>
              <p className="paso__texto">{texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
