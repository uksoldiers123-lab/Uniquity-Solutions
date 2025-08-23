(function () {
  // Config from env.js
  const CFG = window.ENV || {};
  const SUPABASE_URL = CFG.SUPABASE_URL;
  const SUPABASE_ANON_KEY = CFG.SUPABASE_ANON_KEY;
  const DASHBOARD_LOGIN_URL = (CFG.API_BASE || 'https://dashboard.uniquitysolutions.com') + '/api/create-dashboard-login';

  // DOM helpers
  function qs(id) { return document.getElementById(id); }
  function setMsg(text, type) {
    const el = qs('login-msg');
    if (!el) return;
    el.textContent = text || '';
    el.className = type ? 'msg ' + type : 'msg';
  }
  function setLoading(loading) {
    const btn = qs('login-submit') || qs('login-btn');
    if (btn) { btn.disabled = loading; btn.textContent = loading ? 'Signing in…' : 'Sign In'; }
  }

  // Guard: require config
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY to env.js');
    setMsg('Login unavailable. Please try again later.', 'error');
    return;
  }

  // Load Supabase UMD if not present, then init
  function loadSupabase() {
    return new Promise((resolve, reject) => {
      if (window.supabase && window.supabase.createClient) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load Supabase SDK'));
      document.head.appendChild(s);
    });
  }

  function createSupabaseClient() {
    try {
      return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.error('Supabase init failed:', e);
      setMsg('Login unavailable. Please try again later.', 'error');
      return null;
    }
  }

  async function postJSON(url, body) {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    let data = null;
    try { data = await resp.json(); } catch {}
    if (!resp.ok) {
      const err = new Error((data && data.error) || ('HTTP ' + resp.status));
      err.status = resp.status;
      throw err;
    }
    return data;
  }

  async function ssoToDashboard(user) {
    try {
      const payload = { userId: user.id, email: user.email };
      const data = await postJSON(DASHBOARD_LOGIN_URL, payload);
      if (data && data.dashboardUrl) {
        window.location.href = data.dashboardUrl;
      } else {
        setMsg('Login succeeded but no dashboard URL was returned.', 'error');
        window.location.href = (window.ENV && window.ENV.API_BASE) || 'https://dashboard.uniquitysolutions.com';
      }
    } catch (e) {
      console.error('Dashboard SSO failed:', e);
      setMsg('Signed in, but could not open dashboard. Please try again.', 'error');
    }
  }

  function hookForm(client) {
    const form = qs('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setMsg('', '');
      setLoading(true);

      const email = (qs('email') && qs('email').value || '').trim();
      const password = (qs('password') && qs('password').value || '').trim();

      if (!email || !password) {
        setMsg('Enter your email and password.', 'error');
        setLoading(false);
        return;
      }

      try {
        // Backend login to establish session (cookie)
        const resp = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!resp.ok) {
          const err = await resp.json();
          throw new Error(err.error || 'Login failed');
        }

        const user = await (async () => {
          // Try to fetch current user from Supabase after login
          if (client && client.auth && client.auth.getUser) {
            const { data } = await client.auth.getUser();
            return data?.user;
          }
          return null;
        })();

        if (!user) {
          // Fallback: redirect to dashboard login URL
          window.location.href = DASHBOARD_LOGIN_URL;
          return;
        }

        await ssoToDashboard(user);
      } catch (err) {
        console.error('Sign-in error:', err);
        const friendly = (err && err.message) ? String(err.message) : 'Sign-in failed.';
        setMsg(friendly, 'error');
      } finally {
        setLoading(false);
      }
    });

    // Optional: auto-redirect if already logged in in this session
    if (client && client.auth && client.auth.getUser) {
      client.auth.getUser().then(({ data, error }) => {
        if (data && data.user) {
          ssoToDashboard(data.user);
        }
      });
      client.auth.onAuthStateChange((_event, session) => {
        const user = session && session.user;
        if (user) ssoToDashboard(user);
      });
    }
  }

  // Bootstrap
  (async function init() {
    try {
      await loadSupabase();
      const client = createSupabaseClient();
      if (!client) return;
      hookForm(client);
      console.log('Login initialized.');
    } catch (e) {
      console.error(e);
      setMsg('Login unavailable. Please try again later.', 'error');
    }
  })();
})();
