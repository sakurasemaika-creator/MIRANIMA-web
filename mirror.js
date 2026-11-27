/* MIRANIMA — hero mirror canvas.
   MIRROR + ANIMA: whatever is drawn on one side is reflected across the centre axis,
   and lines gently "boil" like hand-drawn animation while the panel is on screen. */
(() => {
  const panel = document.querySelector('[data-mirror]');
  const canvas = panel && panel.querySelector('canvas');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;

  const hint = document.querySelector('[data-mirror-hint]');
  const clearBtn = panel.querySelector('[data-mirror-clear]');
  const drawBtn = panel.querySelector('[data-mirror-draw]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');

  const LIME = '#e3ff36';
  const BOIL_MS = 125;          // 8 drawings per second, like animating on threes
  const LIVE_MS = 6000;         // lines settle this long after the last activity (WCAG 2.2.2: no endless motion)
  const BOIL_AMPLITUDE = 0.0022; // relative to the panel's short side
  const MAX_POINTS = 9000;

  let width = 0;
  let height = 0;
  let unit = 1;   // short side in CSS px; stroke coordinates are stored relative to it
  let ratio = 1;
  let strokes = [];
  let activeStroke = null;
  let lastPoint = null;
  let intro = null;
  let boilFrame = 0;
  let onScreen = true;
  let rafId = 0;
  let liveUntil = 0;

  /* ---------- The MIRANIMA mark, left half (assets/mark.svg) ---------- */
  const MARK_PATHS = [
    [[99, 383], [99, 126], [164, 229], [164, 383], [99, 383]],
    [[164, 229], [250, 340]],
    [[250, 120], [174, 120], [250, 252]],
  ];
  const MARK_SCALE = 0.44 / 302;          // mark spans 44% of the panel's short side
  const MARK_STROKE = 18 * MARK_SCALE;

  const buildMark = () => MARK_PATHS.map((path) => {
    const points = [];
    for (let i = 0; i < path.length - 1; i += 1) {
      const [x0, y0] = path[i];
      const [x1, y1] = path[i + 1];
      const steps = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 5));
      for (let s = 0; s < steps; s += 1) {
        const t = s / steps;
        points.push([(x0 + (x1 - x0) * t - 250) * MARK_SCALE, (y0 + (y1 - y0) * t - 251.5) * MARK_SCALE, MARK_STROKE]);
      }
    }
    const [lx, ly] = path[path.length - 1];
    points.push([(lx - 250) * MARK_SCALE, (ly - 251.5) * MARK_SCALE, MARK_STROKE]);
    return { points, seed: Math.random() * 10 };
  });

  /* ---------- Rendering ---------- */
  const wobble = (index, seed, frame) => {
    const p = index * 0.11;
    const f = frame * 2.17 + seed;
    return [
      Math.sin(p * 1.7 + f) * 0.6 + Math.sin(p * 0.63 + f * 1.9) * 0.4,
      Math.cos(p * 1.3 + f * 1.4) * 0.6 + Math.sin(p * 0.81 + f * 0.7) * 0.4,
    ];
  };

  const drawStroke = (stroke, count, side, boil) => {
    const pts = stroke.points;
    const n = Math.min(count, pts.length);
    if (n === 0) return;
    const cx = width / 2;
    const cy = height / 2;
    const amp = boil ? BOIL_AMPLITUDE : 0;
    const map = (i) => {
      const [u, v, w] = pts[i];
      const [jx, jy] = amp ? wobble(i, stroke.seed, boilFrame) : [0, 0];
      return [cx + side * (u + jx * amp) * unit, cy + (v + jy * amp) * unit, w * unit];
    };

    if (n === 1) {
      const [x, y, w] = map(0);
      ctx.beginPath();
      ctx.arc(x, y, w / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    let [px, py] = map(0);
    for (let i = 1; i < n; i += 1) {
      const [x, y, w] = map(i);
      const [nx, ny] = i + 1 < n ? map(i + 1) : [x, y];
      const mx = (x + nx) / 2;
      const my = (y + ny) / 2;
      ctx.beginPath();
      ctx.lineWidth = w;
      ctx.moveTo(px, py);
      ctx.quadraticCurveTo(x, y, mx, my);
      ctx.stroke();
      px = mx;
      py = my;
    }
  };

  const render = (now = performance.now()) => {
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = LIME;
    ctx.fillStyle = LIME;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const boil = !reducedMotion.matches && (Boolean(intro) || Boolean(activeStroke) || now < liveUntil);

    let budget = Infinity;
    if (intro) {
      const t = Math.min(1, (now - intro.start) / intro.duration);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      budget = Math.floor(eased * intro.total);
      if (t >= 1) intro = null;
    }

    strokes.forEach((stroke) => {
      const count = stroke.intro ? Math.max(0, Math.min(stroke.points.length, budget)) : stroke.points.length;
      if (stroke.intro && budget !== Infinity) budget -= stroke.points.length;
      drawStroke(stroke, count, 1, boil);
      drawStroke(stroke, count, -1, boil);
    });
  };

  /* ---------- Loop: only runs while something is moving ---------- */
  const needsLoop = (now = performance.now()) => onScreen && document.visibilityState === 'visible'
    && (intro || activeStroke || (!reducedMotion.matches && strokes.length > 0 && now < liveUntil));

  const tick = (now) => {
    rafId = 0;
    if (!needsLoop(now)) { render(now); return; }
    const frame = Math.floor(now / BOIL_MS) % 3;
    if (intro || frame !== boilFrame || activeStroke) {
      boilFrame = frame;
      render(now);
    }
    rafId = requestAnimationFrame(tick);
  };
  const wake = () => { if (!rafId) rafId = requestAnimationFrame(tick); };
  /* Activity keeps the lines alive; hovering the panel wakes them again. */
  const liven = () => { liveUntil = performance.now() + LIVE_MS; wake(); };

  /* ---------- Size ---------- */
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    width = rect.width;
    height = rect.height;
    unit = Math.min(width, height);
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    render();
  };

  /* ---------- Drawing ---------- */
  const toUnits = (event) => {
    const rect = canvas.getBoundingClientRect();
    return [(event.clientX - rect.left - width / 2) / unit, (event.clientY - rect.top - height / 2) / unit];
  };

  const addPoint = (event) => {
    const [u, v] = toUnits(event);
    const time = event.timeStamp;
    let target;
    if (event.pointerType === 'pen' && event.pressure > 0) {
      target = 0.004 + event.pressure * 0.016;
    } else if (lastPoint) {
      const distance = Math.hypot(u - lastPoint.u, v - lastPoint.v) * unit;
      if (distance < 1.2) return;
      const speed = distance / Math.max(1, time - lastPoint.time);
      target = Math.max(0.0055, Math.min(0.014, 0.014 - speed * 0.0035));
    } else {
      target = 0.012;
    }
    const w = lastPoint ? lastPoint.w * 0.65 + target * 0.35 : target;
    activeStroke.points.push([u, v, w]);
    lastPoint = { u, v, w, time };
  };

  const trimHistory = () => {
    let total = strokes.reduce((sum, s) => sum + s.points.length, 0);
    while (total > MAX_POINTS && strokes.length > 1) total -= strokes.shift().points.length;
  };

  const finishIntro = () => {
    intro = null;
  };

  const setHint = (text) => { if (hint) hint.textContent = text; };
  /* Interface text comes from the page, so every language version shares this script. */
  const text = {
    hintFine: panel.dataset.hintFine || '',
    hintTouch: panel.dataset.hintTouch || '',
    draw: panel.dataset.labelDraw || 'Draw',
    done: panel.dataset.labelDone || 'Done',
  };
  const idleHint = () => (coarsePointer.matches ? text.hintTouch : text.hintFine);

  const canDraw = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return false;
    if (event.pointerType === 'touch' && panel.dataset.touch === 'view') return false;
    return true;
  };

  canvas.addEventListener('pointerdown', (event) => {
    if (!canDraw(event)) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    finishIntro();
    activeStroke = { points: [], seed: Math.random() * 10 };
    lastPoint = null;
    strokes.push(activeStroke);
    addPoint(event);
    if (clearBtn) clearBtn.hidden = false;
    render();
    liven();
  });
  canvas.addEventListener('pointerenter', liven);

  canvas.addEventListener('pointermove', (event) => {
    if (!activeStroke) return;
    const events = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];
    (events.length ? events : [event]).forEach(addPoint);
    liveUntil = performance.now() + LIVE_MS;
    render();
  });

  const endStroke = () => {
    if (!activeStroke) return;
    activeStroke = null;
    lastPoint = null;
    trimHistory();
    liven();
    render();
  };
  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointercancel', endStroke);
  canvas.addEventListener('lostpointercapture', endStroke);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      strokes = [];
      intro = null;
      clearBtn.hidden = true;
      render();
    });
  }

  /* Touch screens: drawing is opt-in so the panel never traps page scrolling. */
  const setTouchMode = (mode) => {
    if (!drawBtn) return;
    panel.dataset.touch = mode;
    const drawing = mode === 'draw';
    drawBtn.setAttribute('aria-pressed', String(drawing));
    drawBtn.textContent = drawing ? text.done : text.draw;
  };
  const applyPointerMode = () => {
    if (!drawBtn) return;
    if (coarsePointer.matches) {
      drawBtn.hidden = false;
      setTouchMode(panel.dataset.touch === 'draw' ? 'draw' : 'view');
    } else {
      drawBtn.hidden = true;
      delete panel.dataset.touch;
    }
    setHint(idleHint());
  };
  if (drawBtn) {
    drawBtn.addEventListener('click', () => setTouchMode(panel.dataset.touch === 'draw' ? 'view' : 'draw'));
  }
  coarsePointer.addEventListener('change', applyPointerMode);
  applyPointerMode();

  /* ---------- Visibility ---------- */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (!onScreen && panel.dataset.touch === 'draw') setTouchMode('view');
      if (onScreen) wake();
    }, { threshold: 0.05 }).observe(panel);
  }
  document.addEventListener('visibilitychange', wake);
  reducedMotion.addEventListener('change', () => { render(); wake(); });

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);

  /* ---------- Start: the mark draws itself, then reflects ---------- */
  const mark = buildMark().map((stroke) => ({ ...stroke, intro: true }));
  strokes = mark;
  resize();
  panel.classList.add('is-ready');
  if (!reducedMotion.matches) {
    intro = { start: performance.now() + 350, duration: 1900, total: mark.reduce((n, s) => n + s.points.length, 0) };
    liveUntil = intro.start + intro.duration + LIVE_MS;
  }
  wake();
})();
