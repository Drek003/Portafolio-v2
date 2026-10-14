// ===== DK3 — asistente animado del portafolio =====
// Avatar: Bible Strong Avatar Lab (AGPL-3.0) — https://github.com/smontlouis/bible-strong-avatar-lab
import { createAvatar } from 'https://cdn.jsdelivr.net/npm/@bible-strong/avatar-web@0.1.0/+esm';

const BASE_SIZE = 400; // tamaño interno; se escala con transform
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Animación "de fondo" según la sección visible
const SECTION_MOOD = {
  home: 'happy',
  about: 'curious',
  experience: 'proud',
  skills: 'working',
  projects: 'excited',
  contact: 'listening',
};

const LINES = {
  sections: {
    home: '¡Hola! Soy DK3, el asistente de Derek 👋',
    about: 'Derek es el que programa. Yo pongo las caras.',
    experience: 'Mira todo lo que Derek ha construido 💼',
    skills: 'Vue, Laravel, Python... Derek no se aburre nunca.',
    projects: '¡Mi parte favorita! Sus proyectos 🚀',
    contact: '¿Le escribes? Derek responde rápido, lo he visto.',
  },
  clicks: [
    '¡Jaja, cosquillas!',
    'Eso fue un click, ¿verdad? 👀',
    'Hey, que estoy trabajando 😄',
    'Otra vez y le cuento a Derek.',
  ],
  annoyed: 'Ok, ok... ya basta 😤',
  projects: (name) => `${name}... ese lo vi nacer.`,
  category: (name) => `¡${name}! Buena elección.`,
  primaryBtn: '¡Sí, vamos a verlos!',
  typing: 'Te escucho... ✍️',
  formError: 'Hmm, falta algo por ahí 🤔',
  formSent: '¡Mensaje en camino! 🎉',
  bored: '¿Sigues ahí? 👀',
  sleeping: 'zzz...',
  wake: '¡Estaba despierto, lo juro! 😳',
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

async function initDK3() {
  const root = document.getElementById('dk3');
  const lean = root.querySelector('.dk3-lean');
  const body = document.getElementById('dk3Body');
  const bubble = document.getElementById('dk3Bubble');
  const slot = document.getElementById('dk3Slot');
  const home = document.getElementById('home');
  const heroContent = home.querySelector('.hero-content');
  const contentSection = document.getElementById('about');
  const footer = document.querySelector('.footer');

  const definition = await fetch('dk3.avatar.json').then((r) => {
    if (!r.ok) throw new Error(`dk3.avatar.json: ${r.status}`);
    return r.json();
  });

  const avatar = createAvatar(body, {
    definition,
    defaultAnimation: 'waking',
    size: '100%',
    ariaLabel: 'DK3',
    onError: (error) => console.warn('[DK3]', error.message),
  });
  body.querySelector('.bs-avatar')?.setAttribute('aria-hidden', 'true');

  // ===== Motor de estados =====
  let base = 'happy';
  let current = 'waking';
  let reactTimer = null;
  let asleep = false;

  const play = (animation) => {
    if (current === animation) return;
    current = animation;
    avatar.play(animation);
  };
  const backToBase = () => {
    reactTimer = null;
    if (!asleep) play(base);
  };
  const setBase = (animation) => {
    base = animation;
    if (!reactTimer && !asleep) play(animation);
  };
  // Reacción temporal (animación) y luego vuelve al estado base
  const react = (animation, ms = 2500) => {
    if (asleep) wake();
    play(animation);
    clearTimeout(reactTimer);
    reactTimer = setTimeout(backToBase, ms);
  };
  // Reacción rápida con una sola expresión
  const glance = (expression, ms = 1200) => {
    if (asleep) return;
    current = null;
    avatar.setExpression(expression);
    clearTimeout(reactTimer);
    reactTimer = setTimeout(backToBase, ms);
  };

  // ===== Burbuja de diálogo =====
  let bubbleTimer;
  let lastSay = 0;
  const say = (text, { ms = 3400, force = false } = {}) => {
    const now = Date.now();
    if (!force && now - lastSay < 1800) return;
    lastSay = now;
    bubble.textContent = text;
    bubble.classList.remove('show');
    void bubble.offsetWidth; // reinicia la animación de entrada
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
  };

  // Saludo inicial
  setTimeout(() => {
    play(base);
    say(LINES.sections.home, { force: true, ms: 4200 });
  }, 1400);

  // ===== Secciones =====
  const greeted = new Set(['home']);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      setBase(SECTION_MOOD[id] || 'idle');
      if (!greeted.has(id)) {
        greeted.add(id);
        say(LINES.sections[id], { force: true });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('section[id]').forEach((s) => sectionObserver.observe(s));

  // ===== Hover y clicks =====
  let lastHover = null;
  const seenProjects = new Set();
  document.addEventListener('pointerover', (e) => {
    const target = e.target.closest?.('.project-item, .btn-primary, .tech-card, .nav-item, .timeline-card, .additional-group');
    if (!target || target === lastHover) return;
    lastHover = target;

    if (target.matches('.project-item')) {
      glance('joyful-wide', 1600);
      const name = target.querySelector('.project-title')?.textContent.trim();
      if (name && !seenProjects.has(name)) {
        seenProjects.add(name);
        say(LINES.projects(name));
      }
    } else if (target.matches('.btn-primary')) {
      react('excited', 1800);
      if (target.closest('#home')) say(LINES.primaryBtn);
    } else if (target.matches('.tech-card, .additional-group')) {
      glance('curious-left', 1300);
    } else if (target.matches('.timeline-card')) {
      glance('far-right-glance', 1400);
    } else {
      glance('attentive-left', 900);
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (lastHover && !lastHover.contains(e.relatedTarget)) lastHover = null;
  });

  document.getElementById('categorySelector').addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;
    react('surprised', 1300);
    say(LINES.category(btn.textContent.trim()), { force: true, ms: 2400 });
  });

  let clickCount = 0;
  let clickReset;
  body.addEventListener('click', () => {
    clickCount += 1;
    clearTimeout(clickReset);
    clickReset = setTimeout(() => { clickCount = 0; }, 4000);
    if (clickCount >= 5) {
      react('angry', 2400);
      say(LINES.annoyed, { force: true });
      clickCount = 0;
    } else {
      react('laughing', 2600);
      say(pick(LINES.clicks), { force: true, ms: 2600 });
    }
    root.classList.remove('is-bounced');
    void root.offsetWidth;
    root.classList.add('is-bounced');
  });

  // ===== Formulario =====
  const form = document.getElementById('contactForm');
  let typingSaid = false;
  form.addEventListener('input', () => {
    react('listening', 4000);
    if (!typingSaid) {
      typingSaid = true;
      say(LINES.typing);
    }
  });
  form.addEventListener('submit', () => {
    // script.js valida primero; leemos su resultado en el siguiente tick
    setTimeout(() => {
      const status = document.getElementById('formStatus');
      if (status.classList.contains('error')) {
        react('confused', 2800);
        say(LINES.formError, { force: true });
      } else if (status.classList.contains('ok')) {
        react('celebrate', 4500);
        say(LINES.formSent, { force: true, ms: 4000 });
      }
    }, 0);
  });

  // ===== Inactividad: se aburre y luego se duerme =====
  let idleTimers = [];
  const wake = () => {
    asleep = false;
    play('waking');
    say(LINES.wake, { force: true, ms: 2600 });
    clearTimeout(reactTimer);
    reactTimer = setTimeout(backToBase, 1600);
  };
  const resetIdle = () => {
    idleTimers.forEach(clearTimeout);
    if (asleep) wake();
    idleTimers = [
      setTimeout(() => {
        if (reactTimer) return;
        play('bored');
        say(LINES.bored, { force: true });
      }, 25000),
      setTimeout(() => {
        asleep = true;
        clearTimeout(reactTimer);
        reactTimer = null;
        play('sleeping');
        say(LINES.sleeping, { force: true, ms: 6000 });
      }, 50000),
    ];
  };
  ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((type) =>
    window.addEventListener(type, resetIdle, { passive: true })
  );
  resetIdle();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) avatar.pause();
    else if (current) avatar.play(current);
  });

  // ===== Posición: hero (grande) → lateral (mediano) → mini flotante =====
  const docEl = document.documentElement;
  let mode = '';
  const pos = { x: 0, y: 0, s: 0 };
  const target = { x: 0, y: 0, s: 0 };
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  const pointer = { x: -1, y: -1 };
  let first = true;

  // Mide el texto real del hero (no el bloque de 900px) para usar todo el espacio libre
  const heroTextParts = heroContent.querySelectorAll('.hero-title .line, .hero-desc, .hero-actions .btn');
  const heroFreeSpace = () => {
    const hc = heroContent.getBoundingClientRect();
    let right = hc.left;
    heroTextParts.forEach((el) => { right = Math.max(right, el.getBoundingClientRect().right); });
    return { rect: hc, right, free: window.innerWidth - right - 48 };
  };

  const updateInlineSlot = () => {
    const needsInline = window.innerWidth <= 1024 || heroFreeSpace().free < 260;
    docEl.classList.toggle('dk3-inline', needsInline);
  };

  const computeTarget = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const homeRect = home.getBoundingClientRect();
    const inHero = homeRect.bottom > vh * 0.45;
    let nextMode;

    if (inHero && !docEl.classList.contains('dk3-inline')) {
      const { rect, right, free } = heroFreeSpace();
      const s = Math.min(free * 0.8, vh * 0.6, 460);
      target.s = s;
      target.x = right + 24 + (free - s) / 2;
      target.y = rect.top + rect.height / 2 - s / 2;
      nextMode = 'hero';
    } else if (inHero) {
      const r = slot.getBoundingClientRect();
      target.s = r.width;
      target.x = r.left;
      target.y = r.top;
      nextMode = 'inline';
    } else {
      const contentRight = contentSection.getBoundingClientRect().right;
      const gutter = vw - contentRight;
      if (vw > 1024 && gutter >= 240) {
        const s = Math.min(gutter - 60, 260, vh * 0.4);
        target.s = s;
        target.x = contentRight + (gutter - s) / 2;
        target.y = vh / 2 - s / 2;
        nextMode = 'side';
      } else {
        const s = vw <= 768 ? 84 : 104;
        target.s = s;
        target.x = vw - s - 16;
        target.y = vh - s - 16;
        // Se apoya sobre el footer en vez de taparlo
        const footerTop = footer.getBoundingClientRect().top;
        if (footerTop < vh) target.y -= vh - footerTop;
        nextMode = 'mini';
      }
    }

    if (nextMode !== mode) {
      mode = nextMode;
      root.dataset.mode = mode;
      bubble.dataset.mode = mode;
    }
  };

  let rafId = null;
  const frame = () => {
    rafId = null;
    computeTarget();
    const k = first || prefersReducedMotion ? 1 : 0.14;
    first = false;
    pos.x += (target.x - pos.x) * k;
    pos.y += (target.y - pos.y) * k;
    pos.s += (target.s - pos.s) * k;

    // Mirada: se inclina hacia el cursor
    if (finePointer && pointer.x >= 0 && !prefersReducedMotion) {
      const cx = pos.x + pos.s / 2;
      const cy = pos.y + pos.s / 2;
      tilt.tx = clamp((pointer.x - cx) / window.innerWidth, -0.5, 0.5);
      tilt.ty = clamp((pointer.y - cy) / window.innerHeight, -0.5, 0.5);
    }
    tilt.x += (tilt.tx - tilt.x) * 0.08;
    tilt.y += (tilt.ty - tilt.y) * 0.08;

    root.style.transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0) scale(${(pos.s / BASE_SIZE).toFixed(4)})`;
    lean.style.transform = `translate(${(tilt.x * 40).toFixed(2)}px, ${(tilt.y * 30).toFixed(2)}px) rotate(${(tilt.x * 14).toFixed(2)}deg)`;

    // Ancla de la burbuja: arriba (hero/side), arriba-derecha (mini) o al costado (inline)
    let anchorX = pos.x + pos.s / 2;
    let anchorY = pos.y + pos.s * 0.06;
    if (mode === 'mini') { anchorX = pos.x + pos.s; anchorY = pos.y; }
    if (mode === 'inline') { anchorX = pos.x + pos.s * 1.05; anchorY = pos.y + pos.s / 2; }
    bubble.style.transform = `translate3d(${anchorX.toFixed(2)}px, ${anchorY.toFixed(2)}px, 0)`;

    const moving =
      Math.abs(target.x - pos.x) > 0.3 || Math.abs(target.y - pos.y) > 0.3 ||
      Math.abs(target.s - pos.s) > 0.3 ||
      Math.abs(tilt.tx - tilt.x) > 0.002 || Math.abs(tilt.ty - tilt.y) > 0.002;
    if (moving) requestFrame();
  };
  const requestFrame = () => {
    if (rafId === null) rafId = requestAnimationFrame(frame);
  };

  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', () => {
    updateInlineSlot();
    requestFrame();
  });
  if (finePointer) {
    window.addEventListener('pointermove', (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      requestFrame();
    }, { passive: true });
  }

  updateInlineSlot();
  // Espera a que las fuentes ajusten el layout del hero antes de medir
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    first = true;
    requestFrame();
    root.classList.add('is-ready');
  });
  requestFrame();
}

initDK3().catch((error) => {
  console.warn('[DK3] no se pudo cargar el avatar:', error);
  document.getElementById('dk3')?.remove();
  document.getElementById('dk3Bubble')?.remove();
  document.getElementById('dk3Slot')?.remove();
});
