var gtag;

// Adding to window as a fairly unique name so we can call this from DV widgets
window.bxi = {
  ...window.bxi,
  sendAnalytics: (action, parameters) => {
    parameters = parameters || {};
    parameters.is_prod =
      window.location.host.includes('bxgeneric.org') ||
      window.location.host.includes('bxindustry.org'); // Indicates it's coming from our main bxgeneric instance (e.g. demo.bxgeneric.org) or someone running locally

    parameters.vertical =
      parameters.vertical || window.location.pathname.split('/')[1];

    // Push data to GA4 so we have data to play with while we get it set up
    // This is the future!
    if (typeof gtag === 'function') {
      gtag('event', action, parameters);
    }
  },
};
