import { WebAuth } from 'auth0-js/build/auth0';
import createHistory from 'history/createBrowserHistory';
import config from '../config';
import { getPubkeeper, removeAuthentication, setAuthentication, setSystems } from './storage';

const history = createHistory();

const webAuth = new WebAuth(config.auth0.webAuth);

export const login = () => webAuth.authorize();

export const logout = () => { removeAuthentication(); webAuth.logout(); };

export const isAuthenticated = () => new Date().getTime() < JSON.parse(localStorage.getItem('expires'));

const fetchOrganizations = accessToken => new Promise((resolve) => {
  fetch(`${config.auth0.webAuth.audience}/orgs/organizations`, {
    method: 'get',
    headers: {
      Authorization: `bearer ${accessToken}`,
    } })
    .then(orgs => resolve(orgs.json()));
});

const fetchSystems = (accessToken, organization_id) => new Promise((resolve) => {
  fetch(`${config.auth0.webAuth.audience}/systems`, {
    method: 'get',
    headers: {
      Authorization: `bearer ${accessToken}`,
      'nio-organization': organization_id,
    } })
    .then(systems => resolve(systems.json()));
});

const fetchSystemDetails = (accessToken, organization_id, systemId) => new Promise((resolve) => {
  fetch(`${config.auth0.webAuth.audience}/systems/${systemId}`, {
    method: 'get',
    headers: {
      Authorization: `bearer ${accessToken}`,
      'nio-organization': organization_id,
    } })
    .then(system => resolve(system.json()));
});

export const getPkServers = (accessToken = JSON.parse(localStorage.getItem('accessToken'))) => new Promise((resolve) => {
  const mySystems = {};
  const pkConfig = getPubkeeper();
  let totalSystemCount = 0;

  fetchOrganizations(accessToken).then(orgs =>
    orgs.organizations.map(org => fetchSystems(accessToken, org.organization_id).then((systems) => {
      totalSystemCount += systems.systems.length;
      systems.systems.map((system) => {
        fetchSystemDetails(accessToken, org.organization_id, system.uuid).then((sysDetail) => {
          if (sysDetail.pubkeeper_host && sysDetail.pubkeeper_token && sysDetail.pubkeeper_type === 'hosted') {
            mySystems[system.uuid] = {
              active: pkConfig && pkConfig.PK_JWT === sysDetail.pubkeeper_token,
              org: org.name,
              name: system.name,
              pk_host: sysDetail.pubkeeper_host,
              pk_token: sysDetail.pubkeeper_token,
              type: sysDetail.pubkeeper_type,
            };
          } else {
            totalSystemCount -= 1;
          }
          if (Object.keys(mySystems).length && Object.keys(mySystems).length === totalSystemCount) {
            setSystems(mySystems);
            resolve(history.push('/'));
          }
        });
      });
    })));
});

// After login Auth0 returns the user to ?authorize=true, handle
// the hash data returned from Auth0. then, get the orgs and systems for the user
export const handleAuthentication = () => new Promise((resolve, reject) => {
  try {
    webAuth.parseHash(window.location.hash, (error, result) => {
      const { accessToken, idToken, expiresIn } = result;
      const expires = (parseInt(expiresIn, 10) * 1000) + new Date().getTime();
      setAuthentication(accessToken, idToken, expires);
      resolve(history.push('/'));
    });
  } catch (e) {
    reject(e);
  }
});
