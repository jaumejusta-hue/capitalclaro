
(function () {
  'use strict';

  var canvas = document.getElementById('hero3d');

  if (!canvas || !window.THREE) return;

  var THREE = window.THREE;
  var renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (error) {
    canvas.style.display = 'none';
    return;
  }

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);

  var reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 1.1, 12);

  // ILUMINACIÓN
  scene.add(new THREE.AmbientLight(0xffffff, 0.65));

  var mainLight = new THREE.DirectionalLight(0xffffff, 1.3);
  mainLight.position.set(4, 7, 6);
  scene.add(mainLight);

  var goldLight = new THREE.PointLight(0xffc66b, 2.1, 25);
  goldLight.position.set(-4, 3, 5);
  scene.add(goldLight);

  var blueLight = new THREE.PointLight(0x6f9fd7, 1.4, 25);
  blueLight.position.set(4, -2, 4);
  scene.add(blueLight);

  var world = new THREE.Group();
  scene.add(world);

  var financialGroup = new THREE.Group();
  world.add(financialGroup);

  // MATERIALES
  var gold = new THREE.MeshStandardMaterial({
    color: 0xd9a441,
    metalness: 0.85,
    roughness: 0.24
  });

  var lightGold = new THREE.MeshStandardMaterial({
    color: 0xf1cc7c,
    metalness: 0.8,
    roughness: 0.2
  });

  var blue = new THREE.MeshStandardMaterial({
    color: 0x527eae,
    metalness: 0.55,
    roughness: 0.3
  });

  var darkBlue = new THREE.MeshStandardMaterial({
    color: 0x18334f,
    metalness: 0.45,
    roughness: 0.38
  });

  // PLATAFORMA
  var platform = new THREE.Mesh(
    new THREE.CylinderGeometry(3.8, 4, 0.25, 80),
    darkBlue
  );

  platform.position.set(0, -1.65, 0);
  financialGroup.add(platform);

  var platformRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.65, 0.035, 12, 100),
    lightGold
  );

  platformRing.rotation.x = Math.PI / 2;
  platformRing.position.y = -1.49;
  financialGroup.add(platformRing);

  // GRÁFICA DE CRECIMIENTO
  var bars = [];
  var heights = [0.8, 1.15, 1.55, 2.05, 2.65, 3.25];

  heights.forEach(function (height, index) {
    var bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 1, 0.58),
      index === 5 ? lightGold : blue
    );

    bar.userData.height = height;
    bar.position.set(-2.45 + index * 0.82, -1.5, 0.1);
    bar.scale.y = 0.01;

    bars.push(bar);
    financialGroup.add(bar);
  });

  // LÍNEA DE CRECIMIENTO
  var growthPoints = [
    new THREE.Vector3(-2.5, -0.5, 0.45),
    new THREE.Vector3(-1.7, -0.15, 0.45),
    new THREE.Vector3(-0.9, 0.05, 0.45),
    new THREE.Vector3(-0.1, 0.55, 0.45),
    new THREE.Vector3(0.7, 0.95, 0.45),
    new THREE.Vector3(1.5, 1.65, 0.45)
  ];

  var growthLine = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(growthPoints),
      80,
      0.035,
      8,
      false
    ),
    lightGold
  );

  financialGroup.add(growthLine);

  // MONEDAS APILADAS
  var coins = [];

  for (var i = 0; i < 7; i++) {
    var coin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.56, 0.56, 0.13, 48),
      i % 2 ? gold : lightGold
    );

    coin.position.set(
      2.45 + (i % 2) * 0.08,
      -1.35 + i * 0.12,
      0.65
    );

    coin.rotation.x = 0.08;
    coin.rotation.z = (i % 2) * 0.08;

    coins.push(coin);
    financialGroup.add(coin);
  }

  // TEXTURA DE MONEDA CON EURO
  var coinCanvas = document.createElement('canvas');
  coinCanvas.width = 512;
  coinCanvas.height = 512;

  var context = coinCanvas.getContext('2d');

  var gradient = context.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#f5d58b');
  gradient.addColorStop(0.5, '#d9a441');
  gradient.addColorStop(1, '#a97925');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);

  context.strokeStyle = '#956a27';
  context.lineWidth = 15;
  context.beginPath();
  context.arc(256, 256, 220, 0, Math.PI * 2);
  context.stroke();

  context.strokeStyle = '#f9e3ad';
  context.lineWidth = 5;
  context.beginPath();
  context.arc(256, 256, 195, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = '#805a20';
  context.font = 'bold 270px Georgia, serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('€', 256, 275);

  var coinTexture = new THREE.CanvasTexture(coinCanvas);
  coinTexture.encoding = THREE.sRGBEncoding;

  var coinFace = new THREE.MeshStandardMaterial({
    map: coinTexture,
    metalness: 0.72,
    roughness: 0.25
  });

  var heroCoin = new THREE.Mesh(
    new THREE.CylinderGeometry(1.12, 1.12, 0.2, 80),
    [gold, coinFace, coinFace]
  );

  heroCoin.rotation.x = Math.PI / 2;

  var coinPivot = new THREE.Group();
  coinPivot.add(heroCoin);
  world.add(coinPivot);

  // ANILLO DECORATIVO
  var halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.018, 12, 100),
    lightGold
  );

  halo.rotation.x = 0.35;
  halo.rotation.y = 0.2;
  coinPivot.add(halo);

  // PEQUEÑAS PARTÍCULAS
  var particles = [];

  for (var j = 0; j < 24; j++) {
    var particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.025 + Math.random() * 0.035, 10, 10),
      j % 3 === 0 ? lightGold : blue
    );

    particle.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 2
    );

    particle.userData.phase = Math.random() * Math.PI * 2;
    particles.push(particle);
    world.add(particle);
  }

  // ELEMENTOS DE LA PÁGINA
  var story = document.getElementById('story');
  var word = document.querySelector('.hero-word');
  var glass = document.querySelector('.glass');
  var note = document.querySelector('.hero-note');
  var chapter = document.getElementById('chn');

  var captions = Array.prototype.slice.call(
    document.querySelectorAll('.cap')
  );

  var ranges = [
    [0.08, 0.16, 0.30, 0.38],
    [0.36, 0.44, 0.58, 0.66],
    [0.64, 0.72, 0.84, 0.92]
  ];

  function clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  function segment(value, start, end) {
    return clamp((value - start) / (end - start));
  }

  function ease(value) {
    return value * value * (3 - 2 * value);
  }

  // TAMAÑO RESPONSIVE
  var cameraDistance = 12;

  function resize() {
    var width = canvas.clientWidth || 1;
    var height = canvas.clientHeight || 1;
    var ratio = width / height;

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.75)
    );

    renderer.setSize(width, height, false);

    camera.aspect = ratio;
    camera.updateProjectionMatrix();

    cameraDistance = ratio < 0.8 ? 17 :
      ratio < 1.2 ? 14 :
      ratio < 1.6 ? 12.5 : 11.5;

    world.position.y = ratio < 0.8 ? -0.7 : -0.1;
    world.scale.setScalar(ratio < 0.8 ? 0.78 : 1);
  }

  // PROGRESO DEL SCROLL
  function getProgress() {
    if (reducedMotion || !story) return 1;

    var rect = story.getBoundingClientRect();
    var distance = story.offsetHeight - window.innerHeight;

    if (distance <= 0) return 1;

    return clamp(-rect.top / distance);
  }

  // ANIMACIONES DE TEXTO
  function updateInterface(progress) {
    if (word) {
      word.style.opacity = 1 - 0.55 * segment(progress, 0.1, 0.75);
      word.style.transform =
        'translateY(-' + (58 + progress * 9) + '%)';
    }

    captions.forEach(function (element, index) {
      var range = ranges[index];

      if (!range) return;

      var appear = segment(progress, range[0], range[1]);
      var disappear = segment(progress, range[2], range[3]);

      element.style.opacity = appear * (1 - disappear);

      element.style.transform =
        'translateY(' + ((1 - appear) * 26 - disappear * 26) + 'px)';
    });

    if (glass) {
      var opacity = Math.max(
        1 - segment(progress, 0.05, 0.13),
        segment(progress, 0.9, 0.98)
      );

      glass.style.opacity = opacity;
      glass.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    }

    if (note) {
      note.style.opacity = 1 - segment(progress, 0, 0.06);
    }

    if (chapter) {
      chapter.textContent =
        progress < 0.36 ? '01' :
        progress < 0.64 ? '02' : '03';
    }
  }

  // MOVIMIENTO DEL RATÓN
  var mouseX = 0;
  var mouseY = 0;
  var targetX = 0;
  var targetY = 0;

  var hero = canvas.parentNode;

  if (!reducedMotion && hero) {
    hero.addEventListener('pointermove', function (event) {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    hero.addEventListener('pointerleave', function () {
      targetX = 0;
      targetY = 0;
    });
  }

  // RENDERIZADO
  var visible = true;
  var lastProgress = -1;
  var animationId = null;

  function render(time) {
    var seconds = time * 0.001;
    var progress = getProgress();

    mouseX += (targetX - mouseX) * 0.045;
    mouseY += (targetY - mouseY) * 0.045;

    // Barras que crecen
    bars.forEach(function (bar, index) {
      var start = index * 0.055;
      var amount = 0.3 + 0.7 * ease(
        segment(progress, start, 0.55 + start)
      );

      var height = bar.userData.height * amount;

      bar.scale.y = height;
      bar.position.y = -1.5 + height / 2;
    });

    // Monedas
    coins.forEach(function (coin, index) {
      coin.visible = reducedMotion || progress > 0.2 + index * 0.055;
    });

    // Moneda principal
    coinPivot.position.set(
      0.9 + mouseX * 0.12,
      1.25 + ease(progress) * 0.7,
      1.3
    );

    coinPivot.rotation.y = seconds * 0.45 + progress * 5;
    coinPivot.rotation.x = Math.sin(seconds * 0.45) * 0.08;

    halo.rotation.z = seconds * 0.18;

    // Profundidad y movimiento general
    financialGroup.rotation.y =
      Math.sin(seconds * 0.25) * 0.08 + progress * 0.45;

    world.rotation.y =
      Math.sin(seconds * 0.35) * 0.12 + mouseX * 0.1;

    world.rotation.x = mouseY * 0.055;

    // Partículas flotantes
    particles.forEach(function (particle) {
      var phase = particle.userData.phase;

      particle.position.y += Math.sin(seconds + phase) * 0.0009;
      particle.rotation.y = seconds * 0.15 + phase;
    });

    // Cámara
    camera.position.set(
      mouseX * 0.2,
      1.1 + mouseY * 0.12,
      cameraDistance * (1.1 - 0.1 * ease(progress))
    );

    camera.lookAt(0, 0.25, 0);

    if (progress !== lastProgress) {
      updateInterface(progress);
      lastProgress = progress;
    }

    renderer.render(scene, camera);
  }

  function loop(time) {
    if (!visible || document.hidden) {
      animationId = requestAnimationFrame(loop);
      return;
    }

    render(time);
    animationId = requestAnimationFrame(loop);
  }

  // INICIO
  resize();

  window.addEventListener('resize', resize, { passive: true });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }, { threshold: 0 });

    observer.observe(hero || canvas);
  }

  if (reducedMotion) {
    render(0);
    updateInterface(1);
  } else {
    render(0);
    animationId = requestAnimationFrame(loop);
  }

})();
