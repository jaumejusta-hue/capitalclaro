/* CapitalClaro · capa de movimiento compartida (sin dependencias)
   - transición suave de tema
   - foco de luz que sigue al ratón en las tarjetas
   - títulos palabra a palabra ([data-split])
   - paralaje suave ([data-parallax] > [data-depth])
   - índice con seguimiento de scroll ([data-spy])
   - pestañas accesibles ([data-tabs])
   Todo se desactiva con prefers-reduced-motion. Sin JS, el contenido sigue visible. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var rd = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* 1. Transición suave al cambiar de tema */
  var th = doc.getElementById('th');
  if (th && !rd) {
    th.addEventListener('click', function () {
      root.classList.add('theming');
      setTimeout(function () { root.classList.remove('theming'); }, 600);
    });
  }

  /* 2. Foco de luz en tarjetas */
  if (fine && !rd) {
    doc.querySelectorAll('.cat, .g, .tc, .k, .panel, .sx-card').forEach(function (el) {
      el.classList.add('glow');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* 3. Títulos palabra a palabra */
  if (!rd) {
    doc.querySelectorAll('[data-split]').forEach(function (el) {
      var label = el.textContent.replace(/\s+/g, ' ').trim();
      var n = 0;
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var frag = doc.createDocumentFragment();
            c.nodeValue.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(' ')); return; }
              var o = doc.createElement('span'), i = doc.createElement('span');
              o.className = 'sw'; o.setAttribute('aria-hidden', 'true');
              i.style.setProperty('--i', n++); i.textContent = part;
              o.appendChild(i); frag.appendChild(o);
            });
            node.replaceChild(frag, c);
          } else if (c.nodeType === 1) { walk(c); }
        });
      })(el);
      el.setAttribute('aria-label', label);
      if (!el.classList.contains('rv')) {
        el.classList.add('rv');
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
          }, { threshold: .2 });
          io.observe(el);
        } else { el.classList.add('in'); }
      }
    });
  }

  /* 4. Paralaje suave con el ratón */
  doc.querySelectorAll('[data-parallax]').forEach(function (box) {
    if (!fine || rd) return;
    var layers = box.querySelectorAll('[data-depth]'), raf = 0, tx = 0, ty = 0;
    function paint() {
      raf = 0;
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute('data-depth')) || 0;
        l.style.transform = 'translate3d(' + (tx * d).toFixed(1) + 'px,' + (ty * d).toFixed(1) + 'px,0)';
      });
    }
    box.addEventListener('pointermove', function (e) {
      var r = box.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * 2;
      ty = ((e.clientY - r.top) / r.height - .5) * 2;
      if (!raf) raf = requestAnimationFrame(paint);
    });
    box.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(paint); });
  });

  /* 5. Índice con seguimiento de scroll */
  doc.querySelectorAll('[data-spy]').forEach(function (nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var map = {};
    links.forEach(function (a) { var s = doc.getElementById(a.getAttribute('href').slice(1)); if (s) map[s.id] = a; });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          map[e.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(doc.getElementById(id)); });
  });

  /* 6. Pestañas accesibles */
  doc.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role=tab]'));
    var panels = tabs.map(function (t) { return doc.getElementById(t.getAttribute('aria-controls')); });
    function show(i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
        if (on) { panels[k].classList.remove('swap'); void panels[k].offsetWidth; panels[k].classList.add('swap'); }
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length;
        if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); show((i + 1) % n, true); }
        else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); show((i + n - 1) % n, true); }
        else if (k === 'Home') { e.preventDefault(); show(0, true); }
        else if (k === 'End') { e.preventDefault(); show(n - 1, true); }
      });
    });
    box.classList.add('ready');
    show(0);
  });
})();
