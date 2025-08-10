// main.js v8
// Mobile overlay menu + desktop dropdowns, consistent across all pages
document.addEventListener('DOMContentLoaded', () => {
  // Keep nav height in a CSS var for the mobile overlay top offset
  const nav = document.querySelector('.nav');
  const setNavHeight = () => {
    if (nav) document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  };
  setNavHeight();
  window.addEventListener('resize', setNavHeight);

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMobile = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', open);
      setNavHeight();
    });

    // Close when selecting a link
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMobile);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobile();
    });

    // Close if resized to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMobile();
    });
  }

  // Desktop dropdowns (Get Started, etc.)
  const dropdowns = document.querySelectorAll('[data-dropdown]');

  function closeAllDropdowns(except = null) {
    dropdowns.forEach(d => {
      if (except && d === except) return;
      d.classList.remove('open');
      d.querySelector('[data-toggle]')?.setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach(drop => {
    const toggle = drop.querySelector('[data-toggle]');
    const menu = drop.querySelector('[data-menu]');
    if (!toggle || !menu) return;

    // Toggle on click
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !drop.classList.contains('open');
      closeAllDropdowns(drop);
      drop.classList.toggle('open', willOpen);
      toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    // Keyboard support: Enter/Space toggles when focused on toggle
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });

    // Prevent inside clicks from closing immediately
    menu.addEventListener('click', (e) => e.stopPropagation());
  });

  // Click-away to close any open dropdown
  document.addEventListener('click', () => closeAllDropdowns());

  // ESC closes dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });
});
