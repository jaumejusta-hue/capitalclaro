(function () {
  'use strict';

  var GTM_ID = 'GTM-K8L8QFPS';
  var currency = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
  var currency0 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  function byId(id) { return document.getElementById(id); }
  function stored(key, value) {
    try {
      if (typeof value === 'undefined') return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
    return value;
  }
  function number(id) {
    var el = byId(id);
    if (!el) return 0;
    var n = Number(String(el.value).replace(',', '.'));
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  }
  function text(id, value) {
    var el = byId(id);
    if (el) el.textContent = value;
  }
  function bind(ids, callback) {
    if (!byId(ids[0])) return;
    ids.forEach(function (id) {
      var element = byId(id);
      if (element) {
        element.addEventListener('input', callback);
        element.addEventListener('change', callback);
      }
    });
    callback();
  }

  // Tema claro / oscuro
  var theme = stored('cc-theme2') || document.documentElement.dataset.theme || 'light';
  function setTheme() {
    document.documentElement.dataset.theme = theme;
    var button = byId('th');
    if (button) button.textContent = theme === 'dark' ? '☀ Claro' : '☾ Oscuro';
  }
  var themeButton = byId('th');
  if (themeButton) {
    themeButton.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      stored('cc-theme2', theme);
      setTheme();
    });
  }
  setTheme();

  // Menú móvil accesible
  var menuButton = byId('menu-toggle');
  var nav = byId('main-nav');
  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      nav.classList.toggle('is-open', !expanded);
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  // Calculadora de interés compuesto. Aportaciones al final de cada mes.
  bind(['a', 'b', 'r', 'y'], function () {
    var capital = number('a');
    var monthly = number('b');
    var annualRate = number('r') / 100;
    var years = number('y');
    var months = Math.round(years * 12);
    var monthlyRate = annualRate / 12;
    var result = capital;
    if (months > 0) {
      var factor = Math.pow(1 + monthlyRate, months);
      result = capital * factor + (monthlyRate === 0
        ? monthly * months
        : monthly * ((factor - 1) / monthlyRate));
    }
    var contributed = capital + monthly * months;
    text('o1', currency.format(result));
    text('o2', 'Aportado: ' + currency.format(contributed) + ' · Resultado estimado: ' + currency.format(result - contributed));
  });

  // Aportación mensual aproximada para alcanzar una meta.
  bind(['s_g', 's_y', 's_p', 's_r'], function () {
    var goal = number('s_g');
    var years = number('s_y');
    var saved = number('s_p');
    var monthlyRate = number('s_r') / 1200;
    var months = Math.round(years * 12);
    if (saved >= goal) {
      text('s_o', currency.format(0) + ' · Ya has alcanzado la meta');
      return;
    }
    if (months <= 0) {
      text('s_o', 'Amplía el plazo para calcular una aportación mensual.');
      return;
    }
    var factor = Math.pow(1 + monthlyRate, months);
    var remaining = goal - saved * factor;
    var payment = monthlyRate === 0 ? remaining / months : remaining * monthlyRate / (factor - 1);
    text('s_o', currency.format(Math.max(0, payment)));
  });

  // Regla 50/30/20
  bind(['b_i'], function () {
    var income = number('b_i');
    text('b_o', 'Necesidades (50 %): ' + currency.format(income * 0.5) +
      '\nDeseos (30 %): ' + currency.format(income * 0.3) +
      '\nAhorro y objetivos (20 %): ' + currency.format(income * 0.2));
  });

  // Orientación de capacidad de cuota: no es una oferta ni un estudio hipotecario.
  bind(['h_i', 'h_d', 'h_p'], function () {
    var income = number('h_i');
    var existingDebt = number('h_d');
    var price = number('h_p');
    var lower = Math.max(0, income * 0.30 - existingDebt);
    var upper = Math.max(0, income * 0.35 - existingDebt);
    text('h_o', currency0.format(lower) + ' – ' + currency0.format(upper));
    text('h_s', 'Ahorro previo ilustrativo (30 % del precio): ' + currency0.format(price * 0.30) +
      '. Estimación simplificada: revisa plazo, interés, impuestos, gastos y otras deudas.');
  });

  // IVA. value=0 añade IVA; value=1 extrae IVA de un importe final.
  bind(['v_a', 'v_r', 'v_m'], function () {
    var amount = number('v_a');
    var rate = number('v_r') / 100;
    var mode = byId('v_m') ? byId('v_m').value : '0';
    var base = mode === '1' ? amount / (1 + rate) : amount;
    var tax = base * rate;
    var total = base + tax;
    text('v_n', 'Base imponible: ' + currency.format(base));
    text('v_o', 'Total: ' + currency.format(total));
    text('v_s', 'IVA: ' + currency.format(tax));
  });

  // Búsqueda y filtro del catálogo.
  var search = byId('guide-search');
  var category = byId('guide-category');
  var grid = byId('guide-grid');
  function filterGuides() {
    if (!grid) return;
    var query = search ? search.value.trim().toLocaleLowerCase('es') : '';
    var selected = category ? category.value : 'all';
    var visible = 0;
    Array.prototype.forEach.call(grid.querySelectorAll('.guide-card'), function (card) {
      var textValue = card.textContent.toLocaleLowerCase('es');
      var matchesQuery = !query || textValue.indexOf(query) !== -1;
      var matchesCategory = selected === 'all' || card.dataset.category === selected;
      var show = matchesQuery && matchesCategory;
      card.hidden = !show;
      if (show) visible++;
    });
    var empty = byId('guide-empty');
    if (empty) empty.hidden = visible !== 0;
  }
  if (search) search.addEventListener('input', filterGuides);
  if (category) category.addEventListener('change', filterGuides);
  filterGuides();

  // Google Tag Manager: se carga solo si el usuario ha aceptado analítica.
  var gtmLoaded = false;
  function loadGTM() {
    if (gtmLoaded || !GTM_ID) return;
    gtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID);
    document.head.appendChild(script);
  }
  function cookieBanner() {
    if (stored('cc-ck')) {
      if (stored('cc-ck') === 'yes') loadGTM();
      return;
    }
    var banner = document.createElement('div');
    banner.id = 'ck';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferencias de cookies');
    banner.innerHTML = '<span>Usamos cookies de analítica solo si las aceptas. <a href="cookies.html">Más información</a></span><span class="cookie-actions"><button class="btn" type="button" id="ck-n">Rechazar</button><button class="btn p" type="button" id="ck-y">Aceptar</button></span>';
    document.body.appendChild(banner);
    byId('ck-y').addEventListener('click', function () {
      stored('cc-ck', 'yes');
      banner.remove();
      loadGTM();
    });
    byId('ck-n').addEventListener('click', function () {
      stored('cc-ck', 'no');
      banner.remove();
    });
  }
  cookieBanner();

  // Barra de progreso de lectura
  var progress = byId('prog');
  function updateProgress() {
    if (!progress) return;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var percent = total > 0 ? Math.min(100, window.scrollY / total * 100) : 0;
    progress.style.width = percent + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Reveal progresivo con alternativa segura: si JS o IO no están disponibles, el contenido sigue visible.
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealItems = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('in'); });
  }

  // Contadores de portada
  var counters = document.querySelectorAll('[data-n]');
  function animateCounter(element) {
    var target = Number(element.getAttribute('data-n')) || 0;
    if (reducedMotion) {
      element.textContent = target;
      return;
    }
    var start = null;
    function frame(time) {
      if (start === null) start = time;
      var ratio = Math.min(1, (time - start) / 800);
      element.textContent = Math.round(target * (1 - Math.pow(1 - ratio, 3)));
      if (ratio < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window && !reducedMotion) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });
    counters.forEach(function (counter) { counterObserver.observe(counter); });
  } else {
    counters.forEach(function (counter) { counter.textContent = counter.getAttribute('data-n') || '0'; });
  }
})();
