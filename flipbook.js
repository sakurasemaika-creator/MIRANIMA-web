/* MIRANIMA — NIARIM playback demo.
   The "ball bounce" sample is played one frame at a time (8 fps), the way NIARIM plays a scene.
   Plays only while on screen, can always be paused, and starts paused with reduced motion. */
(() => {
  const root = document.querySelector('[data-flipbook]');
  if (!root) return;

  const current = root.querySelector('[data-fb-current]');
  const prev = root.querySelector('[data-fb-prev]');
  const next = root.querySelector('[data-fb-next]');
  const cells = [...root.querySelectorAll('[data-fb-cell]')];
  const count = root.querySelector('[data-fb-count]');
  const playBtn = root.querySelector('[data-fb-play]');
  const playLabel = root.querySelector('[data-fb-play-label]');
  const onionBtn = root.querySelector('[data-fb-onion]');
  if (!current || !cells.length || !playBtn || !onionBtn) return;

  const total = cells.length;
  const FRAME_MS = 125; // 8 drawings per second
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const labels = { play: root.dataset.labelPlay || 'Play', pause: root.dataset.labelPause || 'Pause' };

  let index = cells.findIndex((cell) => cell.getAttribute('aria-pressed') === 'true');
  if (index < 0) index = 0;
  let playing = false;
  let onScreen = false;
  let timer = 0;

  const setHref = (el, id) => {
    el.setAttribute('href', id);
  };

  const show = (i) => {
    index = (i + total) % total;
    setHref(current, `#fb-f${index}`);
    if (prev) setHref(prev, `#fb-g${(index - 1 + total) % total}`);
    if (next) setHref(next, `#fb-g${(index + 1) % total}`);
    cells.forEach((cell, k) => cell.setAttribute('aria-pressed', String(k === index)));
    if (count) count.textContent = String(index + 1).padStart(2, '0');
  };

  const stopTimer = () => {
    if (timer) window.clearInterval(timer);
    timer = 0;
  };
  const sync = () => {
    const shouldRun = playing && onScreen && document.visibilityState === 'visible';
    if (shouldRun && !timer) timer = window.setInterval(() => show(index + 1), FRAME_MS);
    if (!shouldRun) stopTimer();
  };

  const setPlaying = (value) => {
    playing = value;
    root.classList.toggle('is-playing', value);
    if (playLabel) playLabel.textContent = value ? labels.pause : labels.play;
    sync();
  };

  const setOnion = (value) => {
    root.classList.toggle('is-onion', value);
    onionBtn.setAttribute('aria-pressed', String(value));
  };

  playBtn.addEventListener('click', () => setPlaying(!playing));
  onionBtn.addEventListener('click', () => setOnion(onionBtn.getAttribute('aria-pressed') !== 'true'));
  cells.forEach((cell, k) => cell.addEventListener('click', () => {
    setPlaying(false);
    show(k);
  }));

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    }, { threshold: 0.25 }).observe(root);
  } else {
    onScreen = true;
  }
  document.addEventListener('visibilitychange', sync);

  /* Start: with motion allowed the ball plays from the first frame with onion skin off;
     with reduced motion it rests on the squash frame with onion skin on. */
  playBtn.hidden = false;
  onionBtn.hidden = false;
  if (reducedMotion.matches) {
    setOnion(true);
    show(index);
    setPlaying(false);
  } else {
    setOnion(false);
    show(0);
    setPlaying(true);
  }
})();
