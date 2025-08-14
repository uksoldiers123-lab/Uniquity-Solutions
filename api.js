
Usage:
  const api = createBackendApi({
    baseUrl: 'https://dashboard.uniquitysolutions.com, // e.g. https://uniquity-api-1.onrender.com
    apiKey: window.__CONFIG__?.BACKEND_API_KEY // optional; keep out of code repo
  });

  // 1) Create a PaymentIntent (clientSecret used with Stripe Elements on frontend)
  const { clientSecret } = await api.createPaymentIntent({
    amount: 1250,            // integer cents
    currency: 'usd',         // optional
    invoice: 'INV-1001',     // optional
    receipt_email: 'user@example.com' // optional
  });

  // 2) Create dashboard login URL
  const { dashboardUrl } = await api.createDashboardLogin({
    userId: 'uuid-from-db',
    email: 'user@example.com'
  });

  // 3) Record a payment (creates row and optionally a Stripe PaymentIntent when method === 'card')
  const res = await api.recordPayment({
    account_code: 'ACCT-123',
    amount_cents: 5000,
    currency: 'usd',
    method: 'card',         // 'card' => returns clientSecret; anything else => marks succeeded
    customer_ref: 'ORD-55', // optional
    metadata: { note: 'March subscription' } // optional
  });

*/

function createBackendApi({ baseUrl, apiKey } = {}) {
  if (!baseUrl) {
    throw new Error('createBackendApi missing baseUrl');
  }
  const BASE = baseUrl.replace(/\/+$/, '');

  async function request(path, { method = 'GET', body, headers = {} } = {}) {
    const url = `${BASE}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    if (apiKey) options.headers['x-api-key'] = apiKey;
    if (body != null) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await res.json().catch(() => ({})) : await res.text();

    if (!res.ok) {
      const message = isJson ? (payload.error || payload.message || 'Request failed') : (payload || 'Request failed');
      const err = new Error(message);
      err.status = res.status;
      err.payload = payload;
      throw err;
    }
    return payload;
  }

  // Health
  function health() {
    return request('/health', { method: 'GET' });
  }

  // Payments
  function createPaymentIntent({ amount, currency = 'usd', invoice, receipt_email }) {
    return request('/create-payment-intent', {
      method: 'POST',
      body: { amount, currency, invoice, receipt_email },
    });
  }

  function recordPayment({ account_code, amount_cents, currency = 'usd', method = 'card', customer_ref, metadata }) {
    return request('/payments/record', {
      method: 'POST',
      body: { account_code, amount_cents, currency, method, customer_ref, metadata },
    });
  }

  // Dashboard SSO
  function createDashboardLogin({ userId, email }) {
    return request('/api/create-dashboard-login', {
      method: 'POST',
      body: { userId, email },
    });
  }

  return {
    health,
    createPaymentIntent,
    recordPayment,
    createDashboardLogin,
  };
}

// Optional: attach to window for simple script-tag use
window.createBackendApi = createBackendApi;
--------------------------------------------------

CORS/Origin note (backend side)
Your current backend code only allows a single origin via FRONTEND_ORIGIN, but your env shows CORS_ORIGINS with two origins. Update the backend CORS section to use a CSV list so GitHub Pages (and Hoppscotch) can connect:

Replace:
  app.use(cors({
    origin: [FRONTEND_ORIGIN],
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'authorization'],
  }));

With:
  const rawOrigins = process.env.CORS_ORIGINS || process.env.FRONTEND_ORIGIN || '';
  const origins = rawOrigins
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  app.use(cors({
    origin: (origin, cb) => {
      // allow same-origin or no-origin (mobile/webviews) and configured origins
      if (!origin || origins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS not allowed for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'authorization'],
    credentials: false,
  }));
