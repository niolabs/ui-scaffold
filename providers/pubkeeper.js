import React from 'react';
import { PubkeeperClient, WebSocketBrew } from '@pubkeeper/browser-client';

import config from '../config';

const PubkeeperContext = React.createContext();

export class PubkeeperProvider extends React.Component {
  state = { connected: false };

  componentDidMount = async () => {
    this.pkClient = await new PubkeeperClient({
      server: `${config.PK_SECURE ? 'wss' : 'ws'}://${config.PK_HOST}:${config.PK_PORT}/ws`,
      jwt: config.PK_JWT,
      brews: [new WebSocketBrew({ brewerConfig: { hostname: config.WS_HOST, port: config.WS_PORT, secure: config.WS_SECURE } })],
    }).connect();
    this.pkClient.addBrewer('ui_scaffold.example_brew', brewer => setInterval(() => brewer.brewJSON([{ time: new Date() }]), 1000));
    this.setState({ connected: true });
  };

  render = () => {
    const { children } = this.props;
    const { connected } = this.state;

    return connected ? (
      <PubkeeperContext.Provider value={this.pkClient}>
        {children}
      </PubkeeperContext.Provider>
    ) : null;
  };
}

export const withPubkeeper = Component => props => (
  <PubkeeperContext.Consumer>
    {pkClient => <Component {...props} pkClient={pkClient} />}
  </PubkeeperContext.Consumer>
);
