// ===== Skills Data =====
const skillsData = {
  frontend: {
    label: 'Frontend',
    icon: 'bx bx-code',
    techs: [
      { name: 'Vue.js', icon: 'fa-brands fa-vuejs', tagline: 'Disfruto crear interfaces reactivas y dinámicas con Vue' },
      { name: 'React', icon: 'fa-brands fa-react', tagline: 'React me permite construir componentes reutilizables y escalables' },
      { name: 'Bootstrap', icon: 'fa-brands fa-bootstrap', tagline: 'Con Bootstrap prototipo interfaces rápidas y responsivas' },
    ]
  },
  backend: {
    label: 'Backend',
    icon: 'bx bx-server',
    techs: [
      { name: 'PHP', icon: 'fa-brands fa-php', tagline: 'PHP es mi aliado para el desarrollo web del lado del servidor' },
      { name: 'Python', icon: 'fa-brands fa-python', tagline: 'Python me acompaña en scripts, automatización y análisis' },
      // { name: 'Flask', icon: 'bx bx-flask', tagline: 'Flask me permite crear APIs ligeras y eficientes' },
      { name: 'Laravel', icon: 'fa-brands fa-laravel', tagline: 'Laravel es mi framework para aplicaciones web robustas' },
    ]
  },
  database: {
    label: 'Base de Datos',
    icon: 'bx bx-data',
    techs: [
      { name: 'MySQL', icon: 'bx bx-data', tagline: 'MySQL es mi motor de base de datos relacional de confianza' },
      { name: 'MariaDB', icon: 'bx bx-data', tagline: 'MariaDB me ofrece rendimiento y software libre de calidad' },
      // { name: 'SQLite', icon: 'bx bx-data', tagline: 'SQLite es perfecto para prototipos y aplicaciones ligeras' },
      { name: 'SQL Server', icon: 'bx bx-data', tagline: 'SQL Server me da potencia y escalabilidad empresarial' },
    ]
  },
  tools: {
    label: 'Herramientas',
    icon: 'bx bx-wrench',
    techs: [
      { name: 'Git/GitHub', icon: 'fa-brands fa-github', tagline: 'Git y GitHub son mi flujo de trabajo diario para colaborar' },
      { name: 'Docker', icon: 'fa-brands fa-docker', tagline: 'Docker simplifica el despliegue y la consistencia de entornos' },
      { name: 'CI/CD', icon: 'bx bx-cycle', tagline: 'CI/CD automatiza mi flujo de entrega continua con calidad' },
    ]
  }
};

const additionalSkills = [
  {
    title: 'Diseño',
    icon: 'bx bx-palette',
    items: ['Figma', 'UI/UX', 'Principios MVC']
  },
  {
    title: 'Metodologías',
    icon: 'bx bx-group',
    items: ['Scrum', 'DevSecOps', 'Jira']
  },
  {
    title: 'Idiomas',
    icon: 'bx bx-world',
    items: ['Español (Nativo)', 'Inglés (Intermedio)']
  }
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ===== Observer (declared outside DOMContentLoaded for reuse) =====
let revealObserver;

// ===== Render Functions =====
function techCardsHTML(categoryKey) {
  return skillsData[categoryKey].techs.map((tech, i) => `
    <div class="tech-card spotlight" style="--i: ${i}">
      <i class="${tech.icon}" aria-hidden="true"></i>
      <div class="tech-card-text">
        <span class="tech-card-name">${tech.name}</span>
        <p class="tech-card-tagline">"${tech.tagline}"</p>
      </div>
    </div>
  `).join('');
}

let categoryTimer;
function renderCategory(categoryKey, animate = false) {
  const container = document.getElementById('techCardsContainer');
  if (!skillsData[categoryKey]) return;

  clearTimeout(categoryTimer);
  if (!animate || prefersReducedMotion || !container.children.length) {
    container.classList.remove('is-leaving');
    container.innerHTML = techCardsHTML(categoryKey);
    return;
  }

  // Salida escalonada → re-render → entrada escalonada (cardIn)
  container.style.minHeight = `${container.offsetHeight}px`;
  container.classList.add('is-leaving');
  categoryTimer = setTimeout(() => {
    container.classList.remove('is-leaving');
    container.innerHTML = techCardsHTML(categoryKey);
    container.style.minHeight = '';
  }, 260);
}

function renderCategoryButtons() {
  const selector = document.getElementById('categorySelector');
  const keys = Object.keys(skillsData);
  const firstKey = keys[0];

  selector.innerHTML = keys.map(key => `
    <button type="button" class="category-btn${key === firstKey ? ' active' : ''}" data-category="${key}"
      aria-pressed="${key === firstKey}">
      <i class="${skillsData[key].icon}" aria-hidden="true"></i>
      <span>${skillsData[key].label}</span>
    </button>
  `).join('');

  selector.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      selector.querySelectorAll('.category-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      renderCategory(btn.dataset.category, true);
    });
  });
}

function renderAdditionalSkills() {
  const grid = document.getElementById('additionalGrid');
  grid.innerHTML = additionalSkills.map((group, i) => `
    <div class="additional-group reveal spotlight" style="--d: ${i * 0.1}s">
      <div class="additional-group-title">
        <i class="${group.icon}" aria-hidden="true"></i> ${group.title}
      </div>
      <div class="additional-items">
        ${group.items.map(item => `<span class="additional-item">${item}</span>`).join('')}
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // ===== Smooth scroll (Lenis, con fallback al smooth nativo) =====
  let lenis = null;
  if (window.Lenis && !prefersReducedMotion) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  const scrollToTarget = (target) => {
    const offset = target.id === 'home' ? 0 : -40;
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.2 });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  // ===== Reveal Observer =====
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== Sidebar toggle =====
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('menuToggle');
  const backdrop = document.getElementById('sidebarBackdrop');

  const setSidebar = (open) => {
    sidebar.classList.toggle('open', open);
    backdrop.classList.toggle('visible', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    toggleBtn.querySelector('i').className = open ? 'bx bx-x' : 'bx bx-menu';
    if (lenis) open ? lenis.stop() : lenis.start();
  };

  toggleBtn.addEventListener('click', () => setSidebar(!sidebar.classList.contains('open')));
  backdrop.addEventListener('click', () => setSidebar(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      setSidebar(false);
      toggleBtn.focus();
    }
  });

  // Sin transiciones mientras se redimensiona (evita que el sidebar "cruce" la pantalla)
  let resizeTimer;
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  window.addEventListener('resize', () => {
    root.classList.add('is-resizing');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => root.classList.remove('is-resizing'), 150);
  });
  mobileQuery.addEventListener('change', (e) => { if (!e.matches) setSidebar(false); });

  // ===== Anchor links: smooth scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (sidebar.classList.contains('open')) setSidebar(false);
      scrollToTarget(target);
      if (id === '#main') target.focus({ preventScroll: true });
      history.replaceState(null, '', id);
    });
  });

  // ===== Nav scroll highlight =====
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');

  const setActive = (id) => {
    navItems.forEach(item => {
      const isActive = item.getAttribute('href') === `#${id}`;
      item.classList.toggle('active', isActive);
      if (isActive) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(section => navObserver.observe(section));

  // ===== Scroll progress + fin de página =====
  const progressBar = document.getElementById('scrollProgress');
  const timeline = document.getElementById('timeline');
  const timelineItems = timeline.querySelectorAll('.timeline-item');

  // La línea del timeline se llena hasta el 60% del viewport y enciende los puntos que alcanza
  const updateTimeline = () => {
    const mark = window.innerHeight * 0.6;
    const rect = timeline.getBoundingClientRect();
    const fill = Math.min(Math.max((mark - rect.top) / rect.height, 0), 1);
    timeline.style.setProperty('--line', fill.toFixed(4));
    timelineItems.forEach(item => {
      const dot = item.querySelector('.timeline-dot').getBoundingClientRect();
      item.classList.toggle('is-reached', dot.top < mark);
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progressBar.style.setProperty('--progress', progress.toFixed(4));
      updateTimeline();
      // La última sección puede no llegar al centro del viewport
      if (max - window.scrollY < 4) setActive('contact');
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Project preview =====
  const projectItems = document.querySelectorAll('.project-item');
  const previewImg = document.getElementById('previewImg');
  const previewMock = document.getElementById('previewMock');
  const mockIndex = document.getElementById('mockIndex');
  const mockTitle = document.getElementById('mockTitle');
  const mockTech = document.getElementById('mockTech');
  const failedImages = new Set();
  let swapTimer;

  const showProject = (item) => {
    if (item.classList.contains('active') && previewImg.dataset.current) return;
    projectItems.forEach(p => p.classList.remove('active'));
    item.classList.add('active');

    const src = item.dataset.img;
    previewImg.dataset.current = src || 'none';
    previewImg.classList.remove('visible');

    // Mock animado con el título del proyecto (se ve si no hay imagen)
    clearTimeout(swapTimer);
    previewMock.classList.add('is-swapping');
    swapTimer = setTimeout(() => {
      mockIndex.textContent = item.querySelector('.project-index').textContent;
      mockTitle.textContent = item.querySelector('.project-title').textContent.trim();
      mockTech.textContent = item.querySelector('.project-tech').textContent;
      previewMock.classList.remove('is-swapping');
    }, prefersReducedMotion ? 0 : 200);

    if (src && !failedImages.has(src)) {
      const loader = new Image();
      loader.onload = () => {
        if (previewImg.dataset.current !== src) return;
        previewImg.src = src;
        previewImg.alt = `Vista previa de ${mockTitle.textContent}`;
        requestAnimationFrame(() => previewImg.classList.add('visible'));
      };
      loader.onerror = () => failedImages.add(src);
      loader.src = src;
    }
  };

  projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => showProject(item));
    item.addEventListener('focusin', () => showProject(item));
  });
  if (projectItems[0]) showProject(projectItems[0]);

  // ===== Spotlight: el brillo sigue al cursor dentro de cada card =====
  if (finePointer) {
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest && e.target.closest('.spotlight');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }, { passive: true });
  }

  // ===== Cursor glow + botones magnéticos (solo desktop) =====
  if (finePointer && !prefersReducedMotion) {
    const glow = document.getElementById('cursorGlow');
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy;
    let glowRunning = false;

    const loop = () => {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) {
        requestAnimationFrame(loop);
      } else {
        glowRunning = false;
      }
    };

    window.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add('active');
      if (!glowRunning) {
        glowRunning = true;
        requestAnimationFrame(loop);
      }
    }, { passive: true });
    document.addEventListener('pointerleave', () => glow.classList.remove('active'));

    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.2;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.setProperty('--tx', `${x}px`);
        btn.style.setProperty('--ty', `${y}px`);
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.setProperty('--tx', '0px');
        btn.style.setProperty('--ty', '0px');
      });
    });
  }

  // ===== Contact form: valida y abre el cliente de correo =====
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const emailLink = document.getElementById('contactEmail');
  const toAddress = emailLink.getAttribute('href').replace('mailto:', '');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstInvalid = null;
    form.querySelectorAll('input, textarea').forEach(field => {
      const group = field.closest('.form-group');
      const valid = field.checkValidity() && field.value.trim() !== '';
      group.classList.toggle('invalid', !valid);
      field.setAttribute('aria-invalid', String(!valid));
      if (!valid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      status.className = 'form-status error';
      status.textContent = 'Revisa los campos marcados.';
      firstInvalid.focus();
      return;
    }

    const { name: nameField, email: emailField, message: messageField } = form.elements;
    const name = nameField.value.trim();
    const subject = encodeURIComponent(`Contacto desde el portafolio — ${name}`);
    const body = encodeURIComponent(`${messageField.value.trim()}\n\n${name}\n${emailField.value.trim()}`);
    window.location.href = `mailto:${toAddress}?subject=${subject}&body=${body}`;

    status.className = 'form-status ok';
    status.textContent = '¡Gracias! Se abrió tu cliente de correo para enviar el mensaje.';
    form.reset();
  });

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.form-group').classList.remove('invalid');
      field.removeAttribute('aria-invalid');
    });
  });

  // ===== Footer year =====
  document.getElementById('year').textContent = new Date().getFullYear();

  // ===== Init Skills =====
  renderCategoryButtons();
  renderCategory(Object.keys(skillsData)[0]);
  renderAdditionalSkills();
});
