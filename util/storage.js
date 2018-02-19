const get = (key, jsonParse) => (jsonParse ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key));
const set = (key, value, jsonStringify) => (jsonStringify ? localStorage.setItem(key, JSON.stringify(value)) : localStorage.setItem(key, value));
const remove = key => localStorage.removeItem(key);

export const setAuthentication = (accessToken, idToken, expires) => {
  set('accessToken', accessToken, true);
  set('idToken', idToken, true);
  set('expires', expires, true);
};

export const removeAuthentication = () => {
  remove('accessToken');
  remove('idToken');
  remove('expires');
};

export const setSystems = (systems) => {
  set('systems', systems, true);
};

export const getSystems = () => get('systems', true);

export const getPubkeeper = () => get('pkConfig', true);

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
  }
};
