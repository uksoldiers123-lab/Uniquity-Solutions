window.UNIQUITY_CONFIG = {
  // REQUIRED: your backend base URL (Render/Fly/Vercel/etc.)
  baseUrl: 'https://dashboard.uniquitysolutions.com, // e.g., https://uniquity-api-1.onrender.com

  // Optional: only include if your backend enforces x-api-key. Note: putting an API key in public GitHub is visible to everyone.
  // If possible, leave BACKEND_API_KEY unset on public endpoints.
  apiKey: '',

  // Stripe publishable key (safe for frontend). Use your test pk for testing.
  stripePublishableKey: 'pk_test_51Rv1XcJ8rYAVrZVt8iJlItcVIk0sOmnKiveDQUx1TVpr79thl3akjWJWVmvTa5QdWgMzk9ZBaXEAnelyZzI7yLkF00Ejbx8thQ',

  // Optional for post-payment navigation (if you want to redirect manually after success)
  successUrl: 'https://uksoldiers123-lab.github.io/Uniquely-solutions/make-payments-success.html',
  cancelUrl: 'https://uksoldiers123-lab.github.io/Uniquely-solutions/make-payments.html?canceled=1'
};
