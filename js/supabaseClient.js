js/supabaseClient.js
// js/supabaseClient.js
// Requires env.js to be loaded first (window.ENV set)
(function () {
  const url = window.ENV && window.ENV.SUPABASE_URL;
  const anon = window.ENV && window.ENV.SUPABASE_ANON_KEY;

  if (!url || !anon) {
    console.warn('Supabase not configured (missing URL or anon key).');
    window.supabase = null;
    return;
  }

  // Load Supabase library if you don’t already bundle it
  // If you already include @supabase/supabase-js elsewhere, remove this dynamic load.
  const loadLib = () =>
    new Promise((resolve, reject) => {
      if (window.supabase) return resolve(); // already present
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });

  loadLib().then(() => {
    const client = window.supabase.createClient(url, anon);
    window.supabaseClient = client; // expose globally for your code
    console.log('Supabase client ready');
  }).catch((e) => {
    console.error('Failed to load Supabase library', e);
    window.supabaseClient = null;
  });
})();
