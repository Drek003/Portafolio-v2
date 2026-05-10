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

// ===== Render Functions =====
function renderCategory(categoryKey) {
  const container = document.getElementById('techCardsContainer');
  const data = skillsData[categoryKey];
  if (!data) return;

  container.innerHTML = data.techs.map(tech => `
    <div class="tech-card reveal">
      <i class="${tech.icon}"></i>
      <span class="tech-card-name">${tech.name}</span>
      <p class="tech-card-tagline">"${tech.tagline}"</p>
    </div>
  `).join('');

  // Observe new reveal elements
  container.querySelectorAll('.reveal').forEach(el => skillsObserver.observe(el));
}

function renderCategoryButtons() {
  const selector = document.getElementById('categorySelector');
  const keys = Object.keys(skillsData);
  const firstKey = keys[0];

  selector.innerHTML = keys.map(key => `
    <button class="category-btn${key === firstKey ? ' active' : ''}" data-category="${key}">
      <i class="${skillsData[key].icon}"></i>
      <span>${skillsData[key].label}</span>
    </button>
  `).join('');

  // Click handler
  selector.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selector.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCategory(btn.dataset.category);
    });
  });
}

function renderAdditionalSkills() {
  const grid = document.getElementById('additionalGrid');
  grid.innerHTML = additionalSkills.map(group => `
    <div class="additional-group reveal">
      <div class="additional-group-title">
        <i class="${group.icon}"></i> ${group.title}
      </div>
      <div class="additional-items">
        ${group.items.map(item => `
          <span class="additional-item">${item}</span>
        `).join('')}
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.reveal').forEach(el => skillsObserver.observe(el));
}

// ===== Observer (declared outside DOMContentLoaded for reuse) =====
let skillsObserver;

document.addEventListener('DOMContentLoaded', () => {

  // ===== Reveal Observer =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Store in skillsObserver for reuse by render functions
  skillsObserver = revealObserver;

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== Nav scroll highlight =====
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item[href^="#"]');

  const updateNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });
    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ===== Smooth scroll =====
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(item.getAttribute('href'));
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top, behavior: 'smooth' });
        sidebar.classList.remove('open');
      }
    });
  });

  // ===== Project preview =====
  const projectItems = document.querySelectorAll('.project-item');
  const previewImg = document.getElementById('previewImg');
  const previewPlaceholder = document.getElementById('previewPlaceholder');

  projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const imgSrc = item.getAttribute('data-img');
      if (imgSrc) {
        previewImg.src = imgSrc;
        previewImg.classList.add('visible');
        previewPlaceholder.style.opacity = '0';
      }
      projectItems.forEach(p => p.classList.remove('active'));
      item.classList.add('active');
    });
  });

  const first = document.querySelector('.project-item[data-img]');
  if (first) {
    const evt = new MouseEvent('mouseenter');
    first.dispatchEvent(evt);
  }

  // ===== Sidebar toggle =====
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('menuToggle');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    const icon = toggleBtn.querySelector('i');
    icon.className = sidebar.classList.contains('open')
      ? 'bx bx-x'
      : 'bx bx-menu';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      toggleBtn.querySelector('i').className = 'bx bx-menu';
    }
  });

  // ===== Init Skills =====
  renderCategoryButtons();
  const firstCategory = Object.keys(skillsData)[0];
  renderCategory(firstCategory);
  renderAdditionalSkills();
});
