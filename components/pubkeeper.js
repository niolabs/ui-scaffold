import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';
import config from '../config';

// configuration for the Pubkeeper client
const pubkeeper_client = new PubkeeperClient({
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

pubkeeper_client.connect();

export default pubkeeper_client;
