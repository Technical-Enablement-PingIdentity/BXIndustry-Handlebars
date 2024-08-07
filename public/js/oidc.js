(() => {
  document.addEventListener('DOMContentLoaded', async () => {
    const redirectUri = `${window.location.origin}/${
      window.location.pathname.split('/')[1]
    }/dashboard`;

    const clientOptions = {
      client_id: window._env_.BXI_REDIRECT_CLIENT_ID,
      redirect_uri: redirectUri,
    };

    const client = await pingOidc.OidcClient.initializeFromOpenIdConfig(
      window._env_.BXI_REDIRECT_ISSUER,
      clientOptions
    );

    if (!window.location.pathname.includes('/dashboard')) {
      // On Home page
      if (await client.hasToken()) {
        window.location.assign(redirectUri);
      }

      const loginBtn = document.getElementById('oidc-login');
      if (loginBtn) {
        loginBtn.removeAttribute('disabled');
        loginBtn.addEventListener('click', async () => {
          await client.authorize();
        });
      }
    } else {
      const logoutBtn = document.getElementById('oidc-logout');
      if (logoutBtn) {
        // Clear bxi.logout call, We don't need to clear the DV_ST cookie or redirect home, endSession does that for us
        logoutBtn.onclick = null;

        logoutBtn.addEventListener('click', async () => {
          await client.endSession();
        });
      }

      // On Dashboard page, in bxi we want to allow users to stay on the dashboard even if they are not authenticated so no redirect home if this hasToken is false
      if (await client.hasToken()) {
        let userInfo;

        try {
          userInfo = await client.fetchUserInfo();
        } catch (error) {
          console.error(
            'An error occurred attempting to fetch user info token is likely expired',
            error
          );
          const refreshedToken = await client.refreshToken();
          if (!refreshedToken) {
            return; // Library will redirect to authorization url
          } else {
            userInfo = await client.fetchUserInfo();
          }
        }

        bxi.updatedUserInfo(userInfo);
      }
    }
  });
})();
