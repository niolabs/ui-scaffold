import Auth0Lock from 'auth0-lock';
import createHistory from 'history/createBrowserHistory';

import config from '../config';

export default class Auth {
  constructor(clientId, domain) {
    this.config = {
      clientId,
      tokenName: 'id_token',
      logoutUrl: `https://${config.AUTH0_URL}/v2/logout`,
      returnUrl: `${window.location.protocol}//${window.location.host}`,
    };

    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: this.config.returnUrl,
        responseType: 'token id_token',
      },
      allowedConnections: ['google-oauth2'],
    });

    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this.doAuthentication.bind(this));
    // binds login functions to keep this context
    this.login = this.login.bind(this);
  }

  doAuthentication(authResult) {
    this.setToken(authResult.idToken);
    window.location = '/';
  }

  login() {
    this.lock.show();
  }

  loggedIn() {
    return !!this.getToken();
  }

  setToken(idToken) {
    localStorage.setItem(this.config.tokenName, idToken);
  }

  getToken() {
    return localStorage.getItem(this.config.tokenName);
  }

  logout() {
    localStorage.removeItem(this.config.tokenName);
    localStorage.removeItem(this.config.profileName);
    window.location.href = `${this.config.logoutUrl}?returnTo=${this.config.returnUrl}&client_id=${this.config.clientId}`;
  }
}
