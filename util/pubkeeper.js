import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';

export default () => {
  const config = JSON.parse(localStorage.getItem('pkConfig'));
  if (config) {
    return new PubkeeperClient({
      server: `${config.PK_SECURE ? 'wss' : 'ws'}://${config.PK_HOST}:${config.PK_PORT}/ws`,
      jwt: config.PK_JWT,
      brews: [
        new WebSocketBrew({
          brewerConfig: {
            hostname: config.WS_HOST,
            port: config.WS_PORT,
            secure: config.WS_SECURE,
          },
        }),
      ],
    });
  }
  return false;
};
