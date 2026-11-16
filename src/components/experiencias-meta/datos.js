// =====================================================================
// Contenido de la sección "Descubre las experiencias del Meta".
// Todo lo que se cambia a mano (textos y videos) está aquí.
// =====================================================================

// ---------------------------------------------------------------------
// LAS EXPERIENCIAS
// video / videoMovil: archivos propios en public/videos/experiencias/
//   (horizontal 1920x1080 y vertical 1080x1920, 8 a 20 s).
//   Si el archivo todavía no existe, se usa "respaldo".
// respaldo: video provisional de internet (puede ser null).
// poster: foto fija que se ve mientras el video carga (opcional).
// tono: colores del fondo mientras carga o si no hay video.
// ---------------------------------------------------------------------
export const EXPERIENCIAS = [
  {
    id: 'cabalgatas',
    titulo: 'Cabalgatas llaneras',
    texto: 'Al paso del caballo criollo, entre morichales y sabana abierta, hasta que cae la tarde.',
    video: '/videos/experiencias/cabalgatas.mp4',
    videoMovil: null,
    // Video vertical: en computador se muestra como un panel a la derecha
    // sobre una foto difuminada del mismo video.
    vertical: true,
    fondo: '/videos/experiencias/cabalgatas-fondo.jpg',
    poster: '/videos/experiencias/cabalgatas-poster.jpg',
    respaldo: 'https://assets.mixkit.co/videos/100660/100660-720.mp4',
    tono: ['#3b4a2a', '#0f231a'],
  },
  {
    id: 'gastronomia',
    titulo: 'Gastronomía llanera',
    texto: 'Mamona, carne a la llanera y cachama al fuego de leña. Sabores que se comparten en la mesa larga.',
    video: '/videos/experiencias/pachamama.mp4', // Pachamama gastrobar
    videoMovil: null,
    vertical: true,
    fondo: '/videos/experiencias/pachamama-fondo.jpg',
    poster: '/videos/experiencias/pachamama-poster.jpg',
    respaldo: null,
    tono: ['#5a3a1f', '#1a120b'],
  },
  {
    id: 'cultura',
    titulo: 'Cultura y tradición',
    texto: 'Arpa, cuatro y maracas. El joropo se zapatea con todo el cuerpo y se vive hasta el amanecer.',
    video: '/videos/experiencias/cultura.mp4', // Los Capachos en concierto
    videoMovil: null,
    vertical: true,
    fondo: '/videos/experiencias/cultura-fondo.jpg',
    poster: '/videos/experiencias/cultura-poster.jpg',
    respaldo: null,
    tono: ['#5b2a22', '#1a0d0b'],
  },
]
