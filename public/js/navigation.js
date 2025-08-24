(function () {
  // Simple nav state updater; ensures Make a Payment is highlighted when on that route
  function highlight() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach((el) => {
      el.classList.remove('active');
      if (el.getAttribute('href') === path || (path === '/' && el.getAttribute('href') === '/index.html')) {
        el.classList.add('active');
      }
    });
  }
  window.addEventListener('DOMContentLoaded', highlight);
})();
