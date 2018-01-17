import Auth0Lock from 'auth0-lock';
import createHistory from 'history/createBrowserHistory';
import config from '../config';

const history = createHistory();

class Auth {
  constructor(clientId, domain) {
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        params: {
          scope: 'openid',
        },
      },
      allowedConnections: ['google-oauth2'],
    });

    this.config = {
      clientId,
      tokenName: 'id_token',
      profileName: 'user_profile',
      logoutUrl: `https://${config.AUTH0_URL}/v2/logout`,
      returnUrl: `${window.location.protocol}//${window.location.host}`,
    };

    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this.doAuthentication.bind(this));
    // binds login functions to keep this context
    this.login = this.login.bind(this);
  }

  doAuthentication(authResult) {
    const thisLogin = this;
    // Saves the user token

    thisLogin.setToken(authResult.idToken);

    thisLogin.lock.getUserInfo(authResult.accessToken, (error, oldProfile) => {
      if (error) {
        history.push('/login');
        return;
      }
      const profile = Object.assign({}, oldProfile);
      thisLogin.setUserProfile(profile);
      window.location.reload();
    });
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    return !!this.getToken();
  }

  setToken(idToken) {
    // Saves user token to local storage
    localStorage.setItem(this.config.tokenName, idToken);
  }

  getToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem(this.config.tokenName);
  }

  logout() {
    localStorage.removeItem(this.config.tokenName);
    localStorage.removeItem(this.config.profileName);
    window.location.href = `${this.config.logoutUrl}?returnTo=${this.config.returnUrl}&client_id=${this.config.clientId}`;
  }

  setUserProfile(profileObject) {
    localStorage.setItem(this.config.profileName, JSON.stringify(profileObject));
  }

  getUserProfile() {
    return JSON.parse(localStorage.getItem(this.config.profileName));
  }
}

const auth = config.APP_REQUIRES_LOGIN ? new Auth(config.AUTH0_ACCT, config.AUTH0_URL) : false;

export default auth;
