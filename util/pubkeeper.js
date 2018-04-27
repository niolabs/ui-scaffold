import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';
import { get, set } from './storage';
import config from '../config';

export const staticPubkeeper = () => config.pubkeeper.staticPubkeeper;

export const getSystems = () => get('systems', true);

export const setSystems = systems => set('systems', systems, true);

export const getPubkeeper = () => (config.pubkeeper.staticPubkeeper ? config.pubkeeper.pkConfig : get('pkConfig', true));

export const setPubkeeper = (uuid) => {
  const systems = get('systems', true);
  if (systems[uuid]) {
    Object.keys(systems).map(k => systems[k].active = k === uuid);
    setSystems(systems);
    set('pkConfig', {
      PK_NAME: systems[uuid].name,
      PK_HOST: systems[uuid].pk_host,
      PK_PORT: 443,
      PK_SECURE: true,
      PK_JWT: systems[uuid].pk_token,
      WS_HOST: systems[uuid].pk_host.indexOf('pk.') !== -1 ? systems[uuid].pk_host.replace('pk', 'ws') : systems[uuid].pk_host.replace('pubkeeper.', 'websocket.'),
      WS_PORT: 443,
      WS_SECURE: true,
    }, true);
    setTimeout(() => window.location.reload(), 500);
  }
};

export const createPubkeeperClient = () => new Promise((resolve, reject) => {
  const pkConfig = getPubkeeper();
  if (pkConfig) {
    resolve(new PubkeeperClient({
      server: `${pkConfig.PK_SECURE ? 'wss' : 'ws'}://${pkConfig.PK_HOST}:${pkConfig.PK_PORT}/ws`,
      jwt: pkConfig.PK_JWT,
      brews: [
        new WebSocketBrew({
          brewerConfig: {
            hostname: pkConfig.WS_HOST,
            port: pkConfig.WS_PORT,
            secure: pkConfig.WS_SECURE,
          },
        }),
      ],
    }));
  } else {
    reject(new Error('no config found'));
  }
});

const fetchOrganizations = accessToken => new Promise((resolve) => {
  fetch(`${config.auth0.webAuth.audience}/orgs/organizations`, {
    method: 'get',
    headers: {
      Authorization: `bearer ${accessToken}`,
    } })
    .then(orgs => resolve(orgs.json()))
    .catch(e => resolve(e));
});

const fetchSystems = (accessToken, organization_id) => new Promise((resolve) => {
  fetch(`${config.auth0.webAuth.audience}/systems`, {
    method: 'get',
    headers: {
      Authorization: `bearer ${accessToken}`,
      'nio-organization': organization_id,
    } })
    .then(systems => resolve(systems.json()))
    .catch(e => resolve(e));
});

const fetchSystemDetails = (accessToken, organization_id, systemId) => new Promise((resolve) => {
  fetch(`${config.auth0.webAuth.audience}/systems/${systemId}`, {
    method: 'get',
    headers: {
      Authorization: `bearer ${accessToken}`,
      'nio-organization': organization_id,
    } })
    .then(system => resolve(system.json()))
    .catch(e => resolve(e));
});

export const fetchPubkeeperServers = () => new Promise((resolve, reject) => {
  const mySystems = {};
  const pkConfig = getPubkeeper();
  const accessToken = get('accessToken', true);
  let totalSystemCount = 0;
  let loopTimeout;

  setSystems(false);

  fetchOrganizations(accessToken).then((orgs) => {
    orgs.organizations.map(org => fetchSystems(accessToken, org.organization_id).then((systems) => {
      totalSystemCount += systems.systems.length;
      systems.systems.map(system =>
        fetchSystemDetails(accessToken, org.organization_id, system.uuid).then((sysDetail) => {
          clearTimeout(loopTimeout);
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
            resolve(setSystems(mySystems));
          } else {
            loopTimeout = setTimeout(() => {
              resolve(setSystems(mySystems));
            }, 1000);
          }
        }).catch(() => reject(new Error('We were unable to fetch your system details.'))));
    }).catch(() => reject(new Error('We were unable to fetch your systems.'))));
  }).catch(() => reject(new Error('We were unable to fetch your organizations.')));
});

export const processPubkeeperData = (data) => {
  const json = new TextDecoder().decode(data);
  return Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
};
