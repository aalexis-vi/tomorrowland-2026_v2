PROYECTO WEB: DAVID GUETTA
==========================

Estructura:
- index.html          Inicio: portada, biografía, discografía, canciones,
                      galería (carrusel) y videos En vivo
- trayectoria.html    Línea de tiempo, estilos y proyectos, curiosidades
- premios.html        Premios y reconocimientos
- merchandising.html  Colección de merchandising (camisetas, sudadera, gorra, etc.)
- contacto.html       Ubicación de Tomorrowland en Boom con mapa y canales oficiales
- css/styles.css      Estilos propios (Bootstrap se carga por CDN)
- js/main.js          Reproductor de videos, menú móvil y efectos de scroll (las 5 páginas)
- img/                Imágenes optimizadas en WebP
    hero/ bio/ albums/ premios/ galeria/ merch/ brand/
                      Las fotos grandes tienen una versión pequeña (-640, -700, -960)
                      que el navegador usa en celulares gracias a srcset.
- netlify.toml        Configuración de despliegue en Netlify
- material/           Material original (zip, txt). NO se sube a git.

Publicar en Netlify:
- Opción A (recomendada): sube el proyecto a GitHub y en Netlify elige
  "Add new site > Import an existing project". No hace falta comando de
  build; netlify.toml ya indica que se publica la carpeta raíz.
- Opción B: arrastra la carpeta del proyecto a app.netlify.com/drop.
  En ese caso borra o mueve antes la carpeta material/, porque
  arrastrando la carpeta se publica todo lo que contiene.

Caché:
- Netlify guarda css/ y js/ en caché una hora. Por eso las 5 páginas cargan
  styles.css?v=4 y main.js?v=4: al cambiar el CSS o el JS, sube ese número
  en las 5 páginas para que los visitantes reciban la versión nueva al momento.

Videos:
- Se reproducen dentro de la página con la API oficial de YouTube
  (youtube-nocookie.com). Solo se cargan cuando alguien da clic.
- Algunos videos tienen la reproducción fuera de YouTube bloqueada por
  los titulares de derechos (depende del país). La página lo detecta y
  muestra un botón "Ver en YouTube" en lugar del error.
- Abriendo index.html con doble clic (file://) YouTube no permite
  reproducir videos incrustados (Error 153). Para probar en tu equipo usa
  un servidor local, por ejemplo:  npx http-server -p 8080
  y abre http://localhost:8080
- Para cambiar o añadir videos, edita la lista con clase "playlist" en
  index.html (atributos data-video-id, data-title y data-desc).

Mapa (contacto.html):
- Es un mapa de OpenStreetMap incrustado: no necesita clave ni cuenta.
- "Cómo llegar" abre la ruta en Google Maps hacia el parque De Schorre.

Animaciones:
- Todas respetan la opción del sistema "reducir movimiento".
- El cambio entre páginas usa View Transitions (Chrome, Edge, Safari);
  en los demás navegadores la página cambia normal.

Bootstrap incluido:
- Navbar responsive con menú hamburguesa.
- Grid con container, row, col-* y row-cols-* con breakpoints.
- Carrusel para la galería de fotos (flechas, puntos y deslizar con el dedo).
- Bootstrap 5.3.3 por CDN.

Nota:
Página informativa no oficial de carácter académico. Verifica fechas,
lanzamientos y premios en los canales oficiales antes de publicar.
