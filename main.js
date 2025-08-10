
// main.js
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const setNavHeight = () => {
    if (nav) document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  };
  setNavHeight();
  window.addEventListener('resize', setNavHeight);

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    const closeMobile = () => {
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    };

    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', open);
      setNavHeight();
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMobile);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobile();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMobile();
    });
  }

  // Desktop-only dropdowns (Get Started)
  const media = window.matchMedia('(min-width: 981px)');
  const initDropdowns = () => {
    document.querySelectorAll('[data-dropdown]').forEach(drop => {
      const toggle = drop.querySelector('[data-toggle]');
      const menu = drop.querySelector('[data-menu]');
      if (!toggle || !menu) return;

      // Remove old handler if re-initializing
      if (drop.__handler) toggle.removeEventListener('click', drop.__handler);

      if (media.matches) {
        drop.__handler = (e) => {
          e.stopPropagation();
          const open = drop.classList.toggle('open');
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        };
        toggle.addEventListener('click', drop.__handler);
      } else {
        drop.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  };
  initDropdowns();
  media.addEventListener('change', initDropdowns);

  // Close any open dropdown when clicking outside (desktop)
  document.addEventListener('click', () => {
    document.querySelectorAll('[data-dropdown].open').forEach(d => {
      d.classList.remove('open');
      d.querySelector('[data-toggle]')?.setAttribute('aria-expanded', 'false');
    });
  });
});

