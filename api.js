const api = createBackendApi({
  baseUrl: 'https://uniquity-api-1.onrender.com', // your backend API base URL
  apiKey: window.__CONFIG__?.BACKEND_API_KEY // optional; if BACKEND_API_KEY is set on backend
});

// 1) Create a PaymentIntent
const { clientSecret } = await api.createPaymentIntent({
  amount: 1250,
  currency: 'usd',
  invoice: 'INV-1001',
  receipt_email: 'user@example.com'
});

// 2) Create dashboard login URL
const { dashboardUrl } = await api.createDashboardLogin({
  userId: 'uuid-from-db',
  email: 'user@example.com'
});

// 3) Record a payment
const res = await api.recordPayment({
  account_code: 'ACCT-123',
  amount_cents: 5000,
  currency: 'usd',
  method: 'card',
  customer_ref: 'ORD-55',
  metadata: { note: 'March subscription' }
});

Frontend file: api.js
/*
Drop this into your frontend (e.g., /assets/js/api.js) and load it via a script tag.
Ensure baseUrl points to your backend deployment.
Do NOT expose any backend secrets in the browser.
*/

function createBackendApi({ baseUrl, apiKey } = {}) {
  if (!baseUrl) throw new Error('createBackendApi missing baseUrl');
  const BASE = baseUrl.replace(/\/+$/, '');

  async function request(path, { method = 'GET', body, headers = {} } = {}) {
    const url = `${BASE}${path}`;
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
    };
    if (apiKey) opts.headers['x-api-key'] = apiKey;
    if (body != null) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const ct = res.headers.get('content-type') || '';
    const isJson = ct.includes('application/json');
    const data = isJson ? await res.json().catch(() => ({})) : await res.text();

    if (!res.ok) {
      const msg = isJson ? (data.error || data.message || 'Request failed') : (data || 'Request failed');
      const err = new Error(msg);
      err.status = res.status;
      err.payload = data;
      throw err;
    }
    return data;
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

  return { health, createPaymentIntent, recordPayment, createDashboardLogin };
}

if (typeof window !== 'undefined') {
  window.createBackendApi = createBackendApi;
}

Backend CORS configuration reminder
Your backend currently uses only FRONTEND_ORIGIN. Since you want GitHub Pages and Hoppscotch, switch to a CSV list:

- Environment:
  - CORS_ORIGINS=https://uksoldiers123-lab.github.io,https://hoppscotch.io
  - FRONTEND_ORIGIN can stay set, but CORS_ORIGINS will be used.

- Code change (replace the existing app.use(cors(...)) with this):

const rawOrigins = process.env.CORS_ORIGINS || process.env.FRONTEND_ORIGIN || '';
const origins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS not allowed for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key', 'authorization'],
}));
