(function() {
  // Call this after your login flow completes successfully
  async function onSuccessfulLogin(user) {
    try {
      // Call the dashboard login endpoint on your domain
      const resp = await fetch('https://dashboard.uniquitysolutions.com/api/create-dashboard-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email })
      });

      // If the response isn't valid JSON, this will throw
      const data = await resp.json();

      if (data && data.dashboardUrl) {
        window.location.href = data.dashboardUrl;
      } else {
        console.error('No dashboard URL returned');
        // Optional fallback: navigate to a default dashboard or show a message
        // window.location.href = 'https://dashboard.uniquitysolutions.com';
      }
    } catch (err) {
      console.error('Failed to get dashboard login URL:', err);
      // Optional fallback: show a message to the user or navigate to a generic login page
      // window.location.href = '/help/dashboard-login-error';
    }
  }

  // Hook 1: If you already have a global user object after login
  // Example: window.currentUser = { id: '123', email: 'user@example.com' }
  if (window.currentUser && window.currentUser.id && window.currentUser.email) {
    onSuccessfulLogin(window.currentUser);
    return;
  }

  // Hook 2: Listen for a custom event that fires on successful login
  // Example: window.dispatchEvent(new CustomEvent('loginSuccess', { detail: { user } }));
  window.addEventListener('loginSuccess', function(e) {
    if (e && e.detail && e.detail.user && e.detail.user.id && e.detail.user.email) {
      onSuccessfulLogin(e.detail.user);
    }
  });

  // Optional: If you're using a promise-based login flow, you can expose a helper
  // function here to be called from your login flow, e.g.:
  // window.handleLoginSuccess = onSuccessfulLogin;
})();
