/* MIRANIMA — page behaviour: config, header, menu, section state, NIARIM reel. */
(() => {
  const config = window.MIRANIMA_CONFIG || {};
  const root = document.documentElement;

  /* ---------- Official addresses and links from site.config.js ---------- */
  document.querySelectorAll('[data-email]').forEach((link) => {
    const address = config[link.dataset.email];
    if (!address) return;
    link.href = `mailto:${address}`;
    const text = link.querySelector('[data-email-text]') || (link.children.length ? null : link);
    if (text) text.textContent = address;
  });
  document.querySelectorAll('[data-link]').forEach((link) => {
    const url = config[link.dataset.link];
    if (url) link.href = url;
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Header border once the page has scrolled ---------- */
  const header = document.querySelector('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector('[data-menu-btn]');
  const menu = document.querySelector('[data-menu]');
  const menuLabel = document.querySelector('[data-menu-label]');
  const main = document.querySelector('#main');
  const footer = document.querySelector('.site-footer');

  const setMenu = (open, { restoreFocus = true } = {}) => {
    if (!menuBtn || !menu) return;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    if (menuLabel) menuLabel.textContent = open ? 'Close' : 'Menu';
    root.classList.toggle('menu-open', open);
    [main, footer].forEach((el) => { if (el) el.inert = open; });
    if (open) {
      const first = menu.querySelector('a');
      if (first) first.focus();
    } else if (restoreFocus) {
      menuBtn.focus();
    }
  };

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false, { restoreFocus: false });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) setMenu(false);
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
      if (event.matches && !menu.hidden) setMenu(false, { restoreFocus: false });
    });
  }

  /* ---------- Current section in the header navigation ---------- */
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
    const visible = new Map();
    const update = () => {
      let current = null;
      sections.forEach((section) => { if (visible.get(section)) current = section; });
      navLinks.forEach((link) => {
        const active = current && link.getAttribute('href') === `#${current.id}`;
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting));
      update();
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- NIARIM reel: position indicator on small screens ---------- */
  const scroller = document.querySelector('[data-reel-scroller]');
  const controls = document.querySelector('[data-reel-controls]');
  if (scroller && controls) {
    const frames = [...scroller.querySelectorAll('.frame')];
    const dots = [...controls.querySelectorAll('.reel-dots i')];
    const current = controls.querySelector('[data-reel-current]');
    let ticking = false;

    const sync = () => {
      ticking = false;
      const overflow = scroller.scrollWidth > scroller.clientWidth + 4;
      controls.hidden = !overflow;
      if (!overflow) return;
      const start = scroller.getBoundingClientRect().left;
      let index = 0;
      let best = Infinity;
      frames.forEach((frame, i) => {
        const distance = Math.abs(frame.getBoundingClientRect().left - start - parseFloat(getComputedStyle(scroller).scrollPaddingLeft || 0));
        if (distance < best) { best = distance; index = i; }
      });
      if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4) index = frames.length - 1;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      if (current) current.textContent = String(index + 1).padStart(2, '0');
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(sync); } };
    scroller.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    sync();
  }
})();
