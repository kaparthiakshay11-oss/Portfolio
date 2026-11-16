const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Mouse/trackpad only — tilt + magnetic effects feel broken on touch screens
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Mobile menu ---------------- */
  const topbar = document.querySelector('.topbar');
  const toggle = document.querySelector('.nav-toggle');
  if (topbar && toggle) {
    const setOpen = (open) => {
      topbar.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setOpen(!topbar.classList.contains('open')));
    topbar.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', (e) => { if (!topbar.contains(e.target)) setOpen(false); });
    window.matchMedia('(min-width: 821px)').addEventListener('change', (m) => { if (m.matches) setOpen(false); });
  }

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  document.querySelectorAll('[data-reveal-group]').forEach(group => {
    [...group.children].forEach((child, i) => { child.style.transitionDelay = (i * 70) + 'ms'; });
  });

  /* ---------------- Hero auto-stagger (no HTML edits needed) ---------------- */
  document.querySelectorAll('.hero .wrap').forEach(wrap => {
    const pieces = wrap.querySelectorAll(':scope > *');
    pieces.forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = (i * 110) + 'ms';
      io.observe(el);
    });
  });

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const target = parseFloat(e.target.dataset.count);
      const decimals = e.target.dataset.count.includes('.') ? e.target.dataset.count.split('.')[1].length : 0;
      const dur = 1200;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        e.target.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cio.observe(el));

  /* ---------------- Ambient glow orbs ---------------- */
  if (!reducedMotion) {
    const orbA = document.createElement('div');
    orbA.className = 'orb';
    orbA.style.cssText = 'width:520px;height:520px;top:-160px;right:-140px;background:var(--glow-cool);';
    const orbB = document.createElement('div');
    orbB.className = 'orb';
    orbB.style.cssText = 'width:420px;height:420px;bottom:10%;left:-160px;background:var(--glow-warm);animation-delay:-9s;';
    document.body.prepend(orbB);
    document.body.prepend(orbA);
  }

  /* ---------------- Cursor spotlight on hero ---------------- */
  document.querySelectorAll('.hero').forEach(hero => {
    const spot = document.createElement('div');
    spot.className = 'hero-spotlight';
    hero.prepend(spot);
    if (!reducedMotion && finePointer) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        spot.style.setProperty('--sx', ((e.clientX - r.left) / r.width) * 100 + '%');
        spot.style.setProperty('--sy', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    }
  });

  /* ---------------- Card tilt ---------------- */
  if (!reducedMotion && finePointer) {
    document.querySelectorAll('.card, .bento-card, .bento-feature').forEach(card => {
      card.style.transition = 'transform .25s ease, background .3s ease, box-shadow .3s ease, border-color .3s ease';
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    /* ---------------- Magnetic buttons ---------------- */
    document.querySelectorAll('.btn').forEach(btn => {
      btn.style.transition = 'transform .2s ease, box-shadow .25s ease, background .25s ease';
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = (e.clientX - r.left - r.width / 2) * 0.25;
        const my = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------------- Starfield ---------------- */
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let w, h, stars, shootingStars = [];
  const STAR_COUNT_DENSITY = 9000; // px^2 per star

  // Smaller orbs on phones so the blur doesn't swamp the screen
  if (window.innerWidth < 720) {
    document.querySelectorAll('.orb').forEach(o => { o.style.width = o.style.height = '300px'; });
  }

  // Sharp on retina screens; only reshuffle stars when the WIDTH changes
  // (phones fire resize on every scroll as the address bar hides/shows)
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let lastW = 0;
  function resize(){
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (w === lastW && stars) return;
    lastW = w;
    const count = Math.min(180, Math.floor((w * h) / STAR_COUNT_DENSITY));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.04
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  function maybeSpawnShootingStar(){
    if (reducedMotion) return;
    if (Math.random() < 0.0035 && shootingStars.length < 2) {
      const startX = Math.random() * w * 0.6 + w * 0.2;
      shootingStars.push({
        x: startX, y: -20,
        vx: -2.6 - Math.random() * 1.5,
        vy: 3.2 + Math.random() * 1.4,
        life: 0, maxLife: 40 + Math.random() * 20
      });
    }
  }

  let t = 0;
  function draw(){
    t += 1;
    ctx.clearRect(0, 0, w, h);

    // stars
    stars.forEach(s => {
      const twinkle = 0.55 + 0.45 * Math.sin(t * 0.02 * s.speed + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243,244,251,${(0.55 * twinkle).toFixed(3)})`;
      ctx.fill();
      if (!reducedMotion) {
        s.x += s.drift;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
      }
    });

    // shooting stars
    maybeSpawnShootingStar();
    shootingStars.forEach(sh => {
      const alpha = 1 - sh.life / sh.maxLife;
      ctx.strokeStyle = `rgba(255,217,160,${(alpha * 0.9).toFixed(3)})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
      ctx.stroke();
      sh.x += sh.vx; sh.y += sh.vy; sh.life += 1;
    });
    shootingStars = shootingStars.filter(sh => sh.life < sh.maxLife && sh.y < h + 40);

    requestAnimationFrame(draw);
  }
  draw();
});
