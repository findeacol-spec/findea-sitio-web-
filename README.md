# Findea · Alquiler de fincas y quintas

Sitio web hecho con **Node.js + Vite + React** para alquilar fincas y quintas, con reservas por WhatsApp.

## Cómo correrlo

Necesitas Node.js 18 o superior.

```bash
npm install
npm run dev
```

Se abre solo en http://localhost:5180

Para generar la versión de producción (carpeta `dist/`, lista para subir a Netlify, Vercel o tu hosting):

```bash
npm run build
npm run preview   # para probarla localmente
```

## Qué cambiar primero

| Qué | Dónde |
| --- | --- |
| Nombre de la marca, número de WhatsApp, correo, redes | `src/data/config.js` |
| Fincas (nombre, precio, capacidad, fotos, comodidades) | `src/data/fincas.js` |
| Destinos y opiniones de clientes | `src/data/fincas.js` |
| Colores y tipografías | Variables al inicio de `src/styles.css` |

Las fotos actuales son de ejemplo (Unsplash). Pon las reales en `public/fotos/` y úsalas así: `'/fotos/mi-finca-1.jpg'`.

## Estructura

```
src/
  data/         config.js (marca y WhatsApp), fincas.js (catálogo)
  components/   Header, Hero (buscador), Destinos, Catalogo (filtros), FincaCard,
                ComoReservar, Opiniones, Propietarios, Footer, WhatsAppFlotante
  pages/        Inicio, FincaDetalle (galería + calculadora de reserva), NoEncontrada
  hooks/        useFavoritas (guarda favoritas en el navegador)
  styles.css    todo el diseño
```

## Funciones

- Buscador por destino, fecha y número de personas
- Filtros por tipo, destino, capacidad y comodidades (piscina, jacuzzi, mascotas, aire, río, cancha)
- Ordenar por precio o capacidad, y guardar favoritas
- Página de cada finca con galería a pantalla completa, calculadora de noches y total, y botón que abre WhatsApp con el mensaje de reserva ya escrito
- Diseño adaptado a celular
