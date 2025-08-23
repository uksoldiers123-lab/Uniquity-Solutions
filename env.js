(function () {
  // This file should be loaded BEFORE your app code (e.g., via <script src="/env.js"></script>)
  // Replace all placeholder values with your actual configuration. Do not commit real secrets in public repos.
  window.ENV = {
    // Supabase (client-side safe)
    SUPABASE_URL: 'https://ziltrcaehpshkwganlcy.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_Nz-YK_y_0Vt0ze2SPhozCQ_JcPXNv_v',

    // Backend API base for payments
    API_BASE: 'https://dashboard.uniquitysolutions.com',

    // Optional: success/cancel pages
    SUCCESS_URL: 'https://uniquitysolutions.com/success',
    CANCEL_URL: 'https://uniquitysolutions.com/cancel',

    // Dashboard on-boarding / login endpoints (adjust paths as needed)
    // Example full endpoints:
    // POST /api/login
    // POST /api/create-dashboard-login
    // You can point to a dedicated path if you have different routing
    // Keep as full URL or relative path if you host on same domain
    LOGIN_ENDPOINT: '/api/login',
    DASHBOARD_LOGIN_ENDPOINT: '/api/create-dashboard-login', // returns { dashboardUrl }

    // Optional: if you want to override the dashboard URL in code (fallback)
    DEFAULT_DASHBOARD_URL: 'https://dashboard.uniquitysolutions.com/app'
  };

  // Optional: provide a small helper so pages can read a global config directly
  window.getEnv = function () {
    return window.ENV;
  };
})();
