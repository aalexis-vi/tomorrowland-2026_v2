/* ==========================================================
   DAVID GUETTA — interacciones
   1. Reproductor de videos: muestra la miniatura y carga YouTube
      solo al hacer clic (la página carga más rápido).
   2. Galería: abre cada foto en grande dentro de un modal.
   3. Menú móvil: se cierra al elegir una sección.
   4. Efectos de scroll: barra de progreso, navegación de vidrio,
      portada con parallax, línea de tiempo y entrada en foco.
   ========================================================== */
(function () {
  'use strict';

  /* ---------- 1. Videos ---------- */
  var stage = document.getElementById('videoStage');
  var caption = document.getElementById('videoCaption');
  var items = document.querySelectorAll('.playlist-item');

  // API oficial de YouTube: se carga una sola vez, la primera vez que alguien da play
  var apiReady = null;
  function loadYouTubeApi() {
    if (!apiReady) {
      apiReady = new Promise(function (resolve, reject) {
        window.onYouTubeIframeAPIReady = function () { resolve(window.YT); };
        var script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    return apiReady;
  }

  // Algunos videos tienen la reproducción fuera de YouTube bloqueada por derechos de autor
  // (códigos 101 y 150, que dependen también del país). En ese caso mostramos un aviso propio.
  function showBlocked(id, title) {
    var box = document.createElement('div');
    box.className = 'video-blocked';
    box.innerHTML =
      '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="">' +
      '<div><p>Los titulares de los derechos no permiten reproducir este video fuera de YouTube en tu región.</p>' +
      '<a class="btn btn-neon" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=' + id + '">Ver en YouTube</a></div>';
    box.setAttribute('aria-label', title);
    stage.replaceChildren(box);
  }

  function play(id, title) {
    var mount = document.createElement('div');
    stage.replaceChildren(mount);

    loadYouTubeApi().then(function (YT) {
      new YT.Player(mount, {
        host: 'https://www.youtube-nocookie.com',
        videoId: id,
        playerVars: { autoplay: 1, rel: 0, playsinline: 1 },
        events: {
          onReady: function (event) { event.target.getIframe().title = 'Video: ' + title; },
          onError: function (event) {
            if (event.data === 101 || event.data === 150) showBlocked(id, title);
          }
        }
      });
    }).catch(function () {
      // Si la API no carga (bloqueador, sin conexión), abrimos el video en YouTube
      showBlocked(id, title);
    });
  }

  function select(item) {
    items.forEach(function (el) { el.removeAttribute('aria-current'); });
    item.setAttribute('aria-current', 'true');
    caption.querySelector('h3').textContent = item.dataset.title;
    caption.querySelector('p').textContent = item.dataset.desc;
    play(item.dataset.videoId, item.dataset.title);
  }

  if (stage) {
    var facade = stage.querySelector('.video-facade');
    var poster = facade.querySelector('img');

    // Algunos videos no tienen miniatura en máxima resolución
    poster.addEventListener('error', function () {
      poster.src = 'https://i.ytimg.com/vi/' + facade.dataset.videoId + '/hqdefault.jpg';
    }, { once: true });

    facade.addEventListener('click', function (event) {
      event.preventDefault();
      select(document.querySelector('.playlist-item[aria-current="true"]') || items[0]);
    });

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        select(item);
        // En móvil el reproductor queda arriba de la lista: llevamos a la persona hasta él
        if (window.matchMedia('(max-width: 991.98px)').matches) {
          stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  /* ---------- 2. Galería ---------- */
  var modalEl = document.getElementById('lightbox');
  var photos = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));

  if (modalEl && window.bootstrap && photos.length) {
    var modal = new bootstrap.Modal(modalEl);
    var img = document.getElementById('lightboxImg');
    var cap = document.getElementById('lightboxCaption');
    var current = 0;

    function show(index) {
      current = (index + photos.length) % photos.length;
      var thumb = photos[current].querySelector('img');
      img.src = photos[current].getAttribute('href');
      img.alt = thumb.alt;
      cap.textContent = thumb.alt;
    }

    photos.forEach(function (link, index) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        show(index);
        modal.show();
      });
    });

    modalEl.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
    modalEl.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });
    modalEl.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- 3. Menú móvil ---------- */
  var nav = document.getElementById('mainNav');
  if (nav && window.bootstrap) {
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (nav.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
      });
    });
  }

  /* ---------- 4. Efectos de scroll ---------- */
  var root = document.documentElement;
  // La clase .motion la pone el <head> solo si el sistema no pide reducir movimiento
  var motion = root.classList.contains('motion') && 'IntersectionObserver' in window;
  var navBar = document.querySelector('.site-nav');
  var progress = document.querySelector('.scroll-progress');
  var hero = document.querySelector('.hero');
  var timeline = document.querySelector('.timeline');
  var timelineItems = timeline ? timeline.querySelectorAll('li') : [];

  function clamp(value) { return Math.min(1, Math.max(0, value)); }

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = root.scrollHeight - vh;

    progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    navBar.classList.toggle('is-scrolled', y > 24);
    if (!motion) return;

    // Portada: solo se recalcula mientras está a la vista
    if (hero) {
      var h = hero.offsetHeight;
      if (y < h * 1.1) hero.style.setProperty('--hp', clamp(y / h).toFixed(3));
    }

    // Línea de tiempo: la línea avanza hasta el 65 % de la pantalla y enciende los años que alcanza
    if (timeline) {
      var rect = timeline.getBoundingClientRect();
      var mark = vh * 0.65;
      if (rect.top < vh && rect.bottom > 0) {
        timeline.style.setProperty('--tl', clamp((mark - rect.top) / rect.height).toFixed(3));
        timelineItems.forEach(function (li) {
          li.classList.toggle('is-lit', li.getBoundingClientRect().top + 12 < mark);
        });
      }
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; onScroll(); });
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Entrada en foco: los bloques aparecen desenfocados y se vuelven nítidos al llegar a pantalla
  if (motion) {
    var selector = [
      '.facts-row > div', '.section-title', '.section-intro', '.lead-copy', '.body-copy',
      '.portrait', '.profile', '#discografia .row > .col', '.songs li', '.collabs',
      '.video-stage', '.video-caption', '.playlist li', '.styles-list > div',
      '.awards-grid figure', '.gallery-item', '.trivia li', '.listen-panel', '.site-footer .row > div'
    ].join(',');
    var perParent = new Map();

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // También se muestran los que quedaron arriba (por ejemplo, al abrir la página en #galeria)
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    document.querySelectorAll(selector).forEach(function (el) {
      // Si un contenedor ya se anima entero, sus hijos no se animan por separado
      if (el.parentElement.closest('[data-reveal]')) return;
      var index = perParent.get(el.parentElement) || 0;
      perParent.set(el.parentElement, index + 1);
      el.style.setProperty('--d', Math.min(index, 6) * 80 + 'ms');
      el.setAttribute('data-reveal', '');
      // Al terminar, quitamos el retraso para que no afecte a otros efectos
      el.addEventListener('transitionend', function () { el.style.removeProperty('--d'); }, { once: true });
      observer.observe(el);
    });

    // Al saltar directo a una sección (enlace con #), lo que quedó arriba se muestra sin esperar
    var revealPassed = function () {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(function (el) {
        if (el.getBoundingClientRect().bottom < 0) {
          el.classList.add('is-in');
          observer.unobserve(el);
        }
      });
    };
    window.addEventListener('load', function () { setTimeout(revealPassed, 100); });
    window.addEventListener('hashchange', revealPassed);
    // Red de seguridad para deslizamientos muy rápidos: al detenerse el scroll,
    // nada de lo que ya quedó atrás sigue oculto
    var settleTimer;
    window.addEventListener('scroll', function () {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(revealPassed, 200);
    }, { passive: true });
  } else {
    root.classList.remove('motion');
  }

  window.__fxReady = true;
})();
