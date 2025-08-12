(function() {
  // Ensure this runs after your login flow completes successfully
  async function onSuccessfulLogin(user) {
    try {
      // Call the dashboard API on your domain (dashboard.uniquitysolutions.com)
      const resp = await fetch('https://dashboard.uniquitysolutions.com/api/create-dashboard-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email })
      });
      const data = await resp.json();
      if (data && data.dashboardUrl) {
        window.location.href = data.dashboardUrl;
      } else {
        console.error('No dashboard URL returned');
      }
    } catch (err) {
      console.error('Failed to get dashboard login URL:', err);
    }
  }

  // If you already have a place where you get "user" after login, call onSuccessfulLogin(user)
  // Example (pseudo):
  // const { user, error } = await supabaseClient.auth.signIn({ ... });
  // if (!error && user) onSuccessfulLogin(user);
})();
