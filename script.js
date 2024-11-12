// script.js

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const menuItems = document.querySelectorAll('.menu-item a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        menuItems.forEach(item => {
            item.parentElement.classList.remove('nav-active');
            if (item.getAttribute('href') === `#${current}`) {
                item.parentElement.classList.add('nav-active');
            }
        });
    });

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
});