// Meridian — small, dependency-free behaviours. Loaded with `defer`.
(() => {
  const d = document, root = d.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header: hide on scroll down, show on scroll up
  const head = d.getElementById('head');
  let lastY = 0, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    if (head && !root.classList.contains('menu-open')) head.classList.toggle('is-hidden', y > 300 && y > lastY + 4);
    if (y < lastY - 4 || y < 300) head && head.classList.remove('is-hidden');
    lastY = y; ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  // Menu
  const btn = d.querySelector('.menu-btn'), menu = d.getElementById('menu');
  if (btn && menu) {
    menu.inert = true;
    const set = (open) => {
      root.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open);
      btn.querySelector('.menu-lbl').textContent = open ? 'Close' : 'Menu';
      menu.inert = !open;
      if (open) menu.querySelector('a')?.focus({ preventScroll: true });
    };
    btn.addEventListener('click', () => set(!root.classList.contains('menu-open')));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('menu-open')) { set(false); btn.focus(); } });
  }

  // Hero word: shrink to fit if a long or wide word would be cut off
  const giant = d.querySelector('.hero-giant');
  if (giant) {
    const fit = () => {
      giant.style.fontSize = '';
      const room = giant.parentElement.clientWidth - parseFloat(getComputedStyle(giant.parentElement).paddingLeft) - parseFloat(getComputedStyle(giant.parentElement).paddingRight);
      const k = room / giant.scrollWidth;
      if (k < 1) giant.style.fontSize = `${parseFloat(getComputedStyle(giant).fontSize) * k * 0.98}px`;
    };
    fit();
    d.fonts?.ready.then(fit);
    addEventListener('resize', fit);
  }

  // Reveal on scroll
  const rev = d.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rev.forEach((el) => io.observe(el));
  } else rev.forEach((el) => el.classList.add('is-in'));

  // Walk film strip: pinned horizontal scroll on desktop
  const strip = d.querySelector('[data-strip]');
  if (strip) {
    const track = strip.querySelector('[data-strip-track]'), bar = strip.querySelector('[data-strip-bar]');
    const mq = matchMedia('(min-width: 900px)');
    let dist = 0;
    const measure = () => {
      if (!mq.matches || reduce) { strip.classList.remove('is-pinned'); track.style.transform = ''; return; }
      strip.classList.add('is-pinned');
      dist = Math.max(0, track.scrollWidth - innerWidth);
      strip.style.setProperty('--strip-h', `${innerHeight + dist}px`);
      update();
    };
    const update = () => {
      if (!strip.classList.contains('is-pinned')) {
        if (bar) bar.style.width = `${Math.min(100, (track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)) * 100)}%`;
        return;
      }
      const r = strip.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      track.style.transform = `translate3d(${-p * dist}px,0,0)`;
      if (bar) bar.style.width = `${p * 100}%`;
    };
    let t = false;
    addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(() => { update(); t = false; }); } }, { passive: true });
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', measure);
    mq.addEventListener?.('change', measure);
    // keyboard focus inside the pinned track: scroll page so the card is in view
    track.addEventListener('focusin', (e) => {
      if (!strip.classList.contains('is-pinned')) return;
      const items = [...track.children], i = items.findIndex((x) => x.contains(e.target));
      const p = i / Math.max(1, items.length - 1);
      scrollTo({ top: strip.offsetTop + p * (strip.offsetHeight - innerHeight), behavior: 'instant' });
    });
    addEventListener('load', measure);
    measure();
  }

  // Sticky split: ground colour follows the panel in view
  const split = d.querySelector('[data-split]');
  if (split && 'IntersectionObserver' in window) {
    const links = split.querySelectorAll('[data-split-link]');
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const p = e.target;
      split.style.setProperty('--split-bg', p.dataset.bg);
      split.style.setProperty('--split-fg', p.dataset.fg);
      links.forEach((l) => l.classList.toggle('is-on', l.dataset.splitLink === p.dataset.splitPanel));
    }), { rootMargin: '-45% 0px -45% 0px' });
    split.querySelectorAll('[data-split-panel]').forEach((p) => io.observe(p));
  }

  // Journey panels: hover/focus/tap opens one
  d.querySelectorAll('[data-panels]').forEach((wrap) => {
    const panels = wrap.querySelectorAll('[data-panel]');
    const open = (p) => panels.forEach((x) => x.classList.toggle('is-open', x === p));
    panels.forEach((p) => {
      p.addEventListener('mouseenter', () => matchMedia('(hover: hover)').matches && open(p));
      p.addEventListener('focusin', () => open(p));
      p.addEventListener('click', (e) => { if (!p.classList.contains('is-open')) { e.preventDefault(); open(p); } });
      p.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === p) { e.preventDefault(); open(p); } });
    });
  });

  // Carousels
  d.querySelectorAll('[data-car]').forEach((nav) => {
    const car = d.getElementById(nav.dataset.car);
    if (!car) return;
    const [prev, next] = nav.querySelectorAll('button');
    const step = () => (car.firstElementChild?.getBoundingClientRect().width || 300) + 16;
    const sync = () => { prev.disabled = car.scrollLeft < 4; next.disabled = car.scrollLeft + car.clientWidth >= car.scrollWidth - 4; };
    nav.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) car.scrollBy({ left: step() * +b.dataset.dir, behavior: reduce ? 'auto' : 'smooth' }); });
    car.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    sync();
  });
})();
