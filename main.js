// - Mobile overlay menu (top-right hamburger)
// - Desktop dropdowns (Get Started, etc.)
// - Keyboard accessibility and basic focus management
document.addEventListener('DOMContentLoaded', () => {
  // Keep nav height for mobile overlay offset
  const nav = document.querySelector('.nav');
  const setNavHeight = () => {
    if (nav) document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  };
  setNavHeight();
  window.addEventListener('resize', setNavHeight);

  // Mobile overlay menu
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

    // Close when selecting a link inside mobile menu
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMobile);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobile();
    });

    // If resized to desktop, close mobile menu
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMobile();
    });
  }

  // Desktop dropdowns
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

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !drop.classList.contains('open');
      closeAllDropdowns(drop);
      drop.classList.toggle('open', willOpen);
      toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    // Keyboard support
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });

    // Prevent inside clicks from closing
    menu.addEventListener('click', (e) => e.stopPropagation());
  });

  // Click-away to close dropdowns
  document.addEventListener('click', () => closeAllDropdowns());

  // ESC closes dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });
});
