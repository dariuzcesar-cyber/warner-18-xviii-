(function () {
  'use strict';
  var doc = document, root = doc.documentElement, body = doc.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (hasGsap) { root.classList.add('js'); gsap.registerPlugin(ScrollTrigger); }

  /* ---------- polvo dorado (canvas) ---------- */
  function dust(canvas, count) {
    if (!canvas || reduce) return { stop: function () {} };
    var ctx = canvas.getContext('2d'), w, h, dpr = Math.min(window.devicePixelRatio || 1, 2), parts = [], raf, running = true;
    function size() {
      var r = canvas.getBoundingClientRect();
      w = canvas.width = r.width * dpr; h = canvas.height = r.height * dpr;
    }
    function make(init) {
      return { x: Math.random() * w, y: init ? Math.random() * h : h + 10,
        r: (Math.random() * 1.6 + .4) * dpr, vy: (Math.random() * .25 + .08) * dpr,
        vx: (Math.random() - .5) * .12 * dpr, a: Math.random() * .6 + .15, t: Math.random() * 6.28 };
    }
    size(); for (var i = 0; i < count; i++) parts.push(make(true));
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i]; p.y -= p.vy; p.x += p.vx + Math.sin(p.t += .01) * .15 * dpr;
        if (p.y < -10) parts[i] = make(false);
        var tw = .55 + Math.sin(p.t * 2) * .45;
        ctx.beginPath(); ctx.fillStyle = 'rgba(232,201,143,' + (p.a * tw).toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener('resize', size);
    tick();
    return { stop: function () { running = false; cancelAnimationFrame(raf); } };
  }
  var gateDust = dust(doc.getElementById('gate-dust'), 70);
  var heroDust = dust(doc.getElementById('dust'), 55);

  /* ---------- videos ---------- */
  var videos = [].slice.call(doc.querySelectorAll('video'));
  // El video principal vive en R2 (soporta Range/206, que iPhone exige); si falla, usa la copia local.
  videos.forEach(function (v) {
    v.addEventListener('error', function () {
      var fb = v.getAttribute('data-fallback');
      if (fb && v.getAttribute('src') !== fb) { v.setAttribute('src', fb); v.load(); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    });
  });
  function playVideos() { videos.forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }); }

  /* ---------- puerta de edad ---------- */
  var gate = doc.getElementById('gate'), ask = gate.querySelector('.gate__ask');
  var skip = /[?&]skip=1/.test(location.search);

  function enter() {
    gate.classList.add('is-out'); gateDust.stop();
    body.classList.remove('is-locked'); body.classList.add('is-ready');
    playVideos(); heroIntro();
    setTimeout(function () { gate.style.display = 'none'; }, 1400);
  }
  doc.getElementById('gate-yes').addEventListener('click', enter);
  doc.getElementById('gate-no').addEventListener('click', function () {
    ask.classList.add('is-denied');
    ask.querySelector('.eyebrow').textContent = 'Acceso restringido';
    ask.querySelector('.gate__text').textContent = 'Este sitio es solo para mayores de edad. Te esperamos cuando cumplas 18.';
    ask.querySelector('.gate__btns').style.display = 'none';
  });
  if (skip) { gate.style.display = 'none'; gateDust.stop(); body.classList.remove('is-locked'); body.classList.add('is-ready'); playVideos(); heroIntro(); }

  /* ---------- intro del hero ---------- */
  function heroIntro() {
    if (!hasGsap || reduce) return;
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: .35 });
    tl.to('.hero__eyebrow', { opacity: 1, y: 0, duration: 1 }, 0)
      .to('.line > span', { y: 0, duration: 1.4, stagger: .16, ease: 'expo.out' }, .1)
      .to('.hero__lead', { opacity: 1, duration: 1 }, .9)
      .to('.hero__cta', { opacity: 1, duration: 1 }, 1.1)
      .to('.arch', { clipPath: 'inset(0% 0 0 0 round 999px 999px 14px 14px)', duration: 1.8, ease: 'expo.inOut' }, .2)
      .to('.hero__frame', { opacity: 1, duration: .6 }, .2)
      .to('.scroll-cue', { opacity: 1, duration: 1 }, 1.8);
  }

  /* ---------- nav ---------- */
  var nav = doc.getElementById('nav'), burger = doc.getElementById('burger'), links = nav.querySelector('.nav__links');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); links.classList.toggle('is-open', open);
    body.classList.toggle('is-locked', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { burger.setAttribute('aria-expanded', 'false'); links.classList.remove('is-open'); body.classList.remove('is-locked'); }
  });

  if (!hasGsap) return;

  /* ---------- reveals ---------- */
  ScrollTrigger.batch('[data-r]', {
    start: 'top 86%', once: true,
    onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.4, stagger: .14, ease: 'expo.out', overwrite: true }); }
  });

  /* ---------- parallax ---------- */
  if (!reduce) {
    gsap.to('.ghost-num', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__frame', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.fromTo('.bottle__photo img', { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.bottle__photo', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.utils.toArray('.chapter__num').forEach(function (n) {
      gsap.fromTo(n, { yPercent: 12 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: n, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- diez años: el color del tequila madura con el scroll ---------- */
  var yearEl = doc.getElementById('year'), capEl = doc.getElementById('caption'), barEl = doc.getElementById('bar'), pin = doc.querySelector('.decade__pin');
  var stops = [
    { p: 0,   t: '2016', c: 'La barrica se cierra.' },
    { p: .22, t: '2019', c: 'La madera empieza a hablar.' },
    { p: .46, t: '2021', c: 'El color se vuelve ámbar profundo.' },
    { p: .7,  t: '2024', c: 'El tiempo redondea cada arista.' },
    { p: .93, t: '2026', c: 'La barrica se abre.' }
  ];
  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function mix(a, b, t) { var A = hex(a), B = hex(b); return 'rgb(' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * t); }).join(',') + ')'; }
  var lastIdx = -1;
  ScrollTrigger.create({
    trigger: '.decade', start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: function (s) {
      var p = s.progress;
      var yr = Math.round(2016 + p * 10); yearEl.textContent = yr;
      barEl.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      pin.style.setProperty('--tone', mix('#f0dca6', '#8c3b12', p));
      pin.style.setProperty('--glow', mix('#d9b872', '#7a3414', p));
      pin.style.setProperty('--glow2', mix('#3b2c16', '#2c1008', p));
      var idx = 0; stops.forEach(function (s2, i) { if (p >= s2.p) idx = i; });
      if (idx !== lastIdx) {
        lastIdx = idx;
        gsap.fromTo(capEl, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' });
        capEl.textContent = stops[idx].c;
      }
    }
  });

  /* ---------- formulario (demo: sin envío real) ---------- */
  var form = doc.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    [].forEach.call(form.elements, function (el) { if (el.willValidate) el.classList.add('touched'); });
    if (!form.checkValidity()) return;
    doc.getElementById('form-ok').hidden = false;
    form.reset();
  });
})();
