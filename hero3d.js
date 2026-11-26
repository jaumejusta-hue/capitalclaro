(function () {
  'use strict';

  var canvas = document.getElementById('hero3d');
  if (!canvas) return;

  // La imagen estática es la versión principal: el 3D es una mejora progresiva.
  var media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  var lowCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  var saveData = connection && (connection.saveData || /2g|slow-2g/.test(connection.effectiveType || ''));
  if ((media && media.matches) || saveData || lowMemory || lowCpu || window.innerWidth < 980) return;

  var started = false;
  function loadThree() {
    if (started || !document.documentElement.contains(canvas)) return;
    started = true;

    function startScene() {
      if (!window.THREE) return;
      var T = window.THREE;
      var renderer;
      try {
        renderer = new T.WebGLRenderer({
          canvas: canvas,
          alpha: true,
          antialias: false,
          powerPreference: 'low-power',
          depth: true,
          stencil: false
        });
      } catch (error) {
        canvas.hidden = true;
        return;
      }

      try {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
        renderer.setClearColor(0x000000, 0);
        if ('outputEncoding' in renderer && T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;

        var scene = new T.Scene();
        var camera = new T.PerspectiveCamera(36, 1, 0.1, 50);
        camera.position.set(0, 0.9, 10);

        scene.add(new T.AmbientLight(0xffffff, 1.05));
        var key = new T.DirectionalLight(0xffe2ad, 1.4);
        key.position.set(3, 5, 6);
        scene.add(key);

        var root = new T.Group();
        scene.add(root);

        var navy = new T.MeshStandardMaterial({ color: 0x173653, roughness: 0.38, metalness: 0.25 });
        var blue = new T.MeshStandardMaterial({ color: 0x416f9d, roughness: 0.34, metalness: 0.28 });
        var gold = new T.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.28, metalness: 0.72 });
        var goldLight = new T.MeshStandardMaterial({ color: 0xf2cc79, roughness: 0.25, metalness: 0.68 });

        // Plataforma y seis barras con geometría sencilla.
        var base = new T.Mesh(new T.CylinderGeometry(3.2, 3.35, 0.16, 24), navy);
        base.position.set(0, -1.65, 0);
        root.add(base);

        [0.65, 0.95, 1.25, 1.65, 2.05, 2.5].forEach(function (height, i) {
          var bar = new T.Mesh(new T.BoxGeometry(0.48, height, 0.48), i === 5 ? gold : blue);
          bar.position.set(-2.15 + i * 0.72, -1.57 + height / 2, -0.05);
          root.add(bar);
        });

        // Hucha estilizada, deliberadamente ligera.
        var pig = new T.Group();
        pig.position.set(1.45, -0.55, 0.8);
        root.add(pig);

        var body = new T.Mesh(new T.SphereGeometry(1.12, 24, 18), navy);
        body.scale.set(1.12, 0.9, 0.83);
        pig.add(body);

        var snout = new T.Mesh(new T.SphereGeometry(0.32, 16, 12), blue);
        snout.position.set(0.84, -0.06, 0.48);
        snout.scale.set(1, 0.72, 0.65);
        pig.add(snout);

        var earGeo = new T.ConeGeometry(0.24, 0.52, 8);
        [-0.58, 0.46].forEach(function (x, i) {
          var ear = new T.Mesh(earGeo, navy);
          ear.position.set(x, 0.85, 0);
          ear.rotation.z = i === 0 ? 0.35 : -0.35;
          pig.add(ear);
        });

        var eyeMat = new T.MeshBasicMaterial({ color: 0xf7f1e5 });
        [-0.38, 0.38].forEach(function (x) {
          var eye = new T.Mesh(new T.SphereGeometry(0.075, 8, 8), eyeMat);
          eye.position.set(x, 0.24, 0.72);
          pig.add(eye);
        });

        // Pilas de monedas con pocas caras y sin sombras en tiempo real.
        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 4; j++) {
            var coin = new T.Mesh(new T.CylinderGeometry(0.34, 0.34, 0.095, 18), j % 2 ? gold : goldLight);
            coin.rotation.x = Math.PI / 2;
            coin.position.set(-2.15 + i * 0.78, -1.4 + j * 0.105, 0.5);
            root.add(coin);
          }
        }

        // Flecha ascendente sencilla.
        var points = [
          new T.Vector3(-2.55, -0.25, 0.35),
          new T.Vector3(-1.5, 0.05, 0.35),
          new T.Vector3(-0.45, 0.35, 0.35),
          new T.Vector3(0.65, 0.85, 0.35),
          new T.Vector3(1.45, 1.4, 0.35)
        ];
        var curve = new T.CatmullRomCurve3(points);
        root.add(new T.Mesh(new T.TubeGeometry(curve, 28, 0.045, 5, false), goldLight));
        var arrow = new T.Mesh(new T.ConeGeometry(0.16, 0.48, 7), gold);
        arrow.position.copy(points[points.length - 1]);
        arrow.rotation.z = -0.72;
        root.add(arrow);

        function resize() {
          var width = canvas.clientWidth || 1;
          var height = canvas.clientHeight || 1;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }

        resize();
        window.addEventListener('resize', resize, { passive: true });

        // Animación corta de entrada: 1,5 s y después se detiene.
        var duration = 950;
        var start = 0;
        var lastFrame = 0;
        var frameInterval = 1000 / 24;
        function animate(now) {
          if (!start) start = now;
          if (now - lastFrame >= frameInterval) {
            lastFrame = now;
            var progress = Math.min(1, (now - start) / duration);
            var eased = progress * progress * (3 - 2 * progress);
            root.rotation.y = -0.12 + eased * 0.12;
            pig.rotation.y = Math.sin(progress * Math.PI) * 0.035;
            pig.position.y = -0.55 + Math.sin(progress * Math.PI) * 0.08;
            renderer.render(scene, camera);
            canvas.classList.add('is-ready');
            var heroSection = canvas.closest ? canvas.closest('.hero-modern') : null;
            if (heroSection) heroSection.classList.add('has-3d');
          }
          if (progress < 1) {
            window.requestAnimationFrame(animate);
          } else {
            // Una última representación estable y ningún bucle continuo.
            root.rotation.y = 0;
            pig.rotation.y = 0;
            renderer.render(scene, camera);
          }
        }
        window.requestAnimationFrame(animate);
      } catch (error) {
        canvas.hidden = true;
      }
    }

    // El motor 3D se descarga de forma asíncrona solo tras cargar la página.
    if (window.THREE) {
      startScene();
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = startScene;
    script.onerror = function () { canvas.hidden = true; };
    document.head.appendChild(script);
  }

  function schedule() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadThree, { timeout: 350 });
    } else {
      window.setTimeout(loadThree, 140);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
})();
