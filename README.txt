PROYECTO WEB: DAVID GUETTA
==========================

Estructura:
- index.html          Página completa (todas las secciones)
- css/styles.css      Estilos propios (Bootstrap se carga por CDN)
- js/main.js          Reproductor de videos, galería ampliada y menú móvil
- img/                Imágenes optimizadas en WebP
    hero/ bio/ albums/ premios/ galeria/ brand/
- favicon.svg         Icono de la pestaña
- netlify.toml        Configuración de despliegue en Netlify
- material/           Material original (zip, txt). NO se sube a git.

Publicar en Netlify:
- Opción A (recomendada): sube el proyecto a GitHub y en Netlify elige
  "Add new site > Import an existing project". No hace falta comando de
  build; netlify.toml ya indica que se publica la carpeta raíz.
- Opción B: arrastra la carpeta del proyecto a app.netlify.com/drop.
  En ese caso borra o mueve antes la carpeta material/, porque
  arrastrando la carpeta se publica todo lo que contiene.

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

Bootstrap incluido:
- Navbar responsive con menú hamburguesa.
- Grid con container, row, col-* y row-cols-* con breakpoints.
- Modal para la galería de fotos.
- Bootstrap 5.3.3 por CDN.

Nota:
Página informativa no oficial de carácter académico. Verifica fechas,
lanzamientos y premios en los canales oficiales antes de publicar.
