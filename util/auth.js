import { WebAuth } from 'auth0-js/build/auth0';
import createHistory from 'history/createBrowserHistory';
import { remove, set, get } from './storage';
import config from '../config';

const history = createHistory();

const webAuth = new WebAuth(config.auth0.webAuth);

const setAuthentication = ({ accessToken, expires }) => {
  set('accessToken', accessToken, true);
  set('expires', expires, true);
};

const removeAuthentication = () => {
  remove('accessToken');
  remove('expires');
};

export const login = () => webAuth.authorize();

export const logout = () => { removeAuthentication(); webAuth.logout({ returnTo: window.location.origin }); };

export const isAuthenticated = () => new Date().getTime() < get('expires');

export const authRequired = () => config.auth0.loginRequired;

// After login Auth0 returns the user to ?authorize=true, handle
// the hash data returned from Auth0. then, get the orgs and systems for the user
export const handleAuthentication = () => new Promise((resolve, reject) => {
  try {
    webAuth.parseHash(window.location.hash, (error, result) => {
      const { accessToken, expiresIn } = result;
      setAuthentication({
        accessToken,
        expires: (parseInt(expiresIn, 10) * 1000) + new Date().getTime(),
      });
      resolve(history.push('/'));
    });
  } catch (e) {
    reject(e);
  }
});
