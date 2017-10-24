import React from 'react';
import { Card, CardBody } from '@nio/ui-kit';

import pubkeeper_client from '../components/pubkeeper_client';

export default class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {};

    const fns = ['startBrewInterval'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    const app = this;

    // connect to the pubkeeper server
    pubkeeper_client.connect().then(() => {
      // publish the count from our dummy stream to the your_brew socket room
      pubkeeper_client.addBrewer('ui_scaffold.example_brew', (brewer) => { app.brewer = brewer; app.startBrewInterval(); });

      // subscribe/add a patron to our own brew to demonstrate how the cycle works
      pubkeeper_client.addPatron('*.**', (patron) => {
        const handler = (data) => {
          const json = new TextDecoder().decode(data);
          const newData = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
          console.log(newData); // eslint-disable-line no-console
        };
        patron.on('message', handler);
        return () => { patron.off('message', handler); };
      });
    })
      .catch(e => console.error(e)); // eslint-disable-line no-console
  }

  componentWillUnmount() {
    const app = this;
    pubkeeper_client.disconnect();
    if (app.brewInterval) clearInterval(app.brewInterval);
  }

  startBrewInterval() {
    const app = this;

    if (app.brewer) {
      app.brewInterval = setInterval(() => {
        const time = new Date();
        console.log('sending time', time);
        app.brewer.brewJSON([{ time }]);
      }, 1000);
    }
  }

  render() {
    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">Home</h2>
          <b>subhead</b>
          <hr className="my-3" />
        </CardBody>
      </Card>
    );
  }
}

