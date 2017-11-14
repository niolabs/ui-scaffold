import React from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

import pubkeeper_client from '../components/pubkeeper_client';

export default class Page extends React.Component {
  constructor() {
    super();
    this.state = {
      rp: 0,
      ard: 0,
      ada: 0,
      spf: 0,
    };

    const fns = ['startBrewInterval'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    const app = this;
    this.demo_output = document.getElementById('demo_output');

    // connect to the pubkeeper server
    pubkeeper_client.connect().then(() => {
      // publish the count from our dummy stream to the your_brew socket room
      // subscribe/add a patron to our own brew to demonstrate how the cycle works
      pubkeeper_client.addPatron('ui_scaffold.example_brew', (patron) => {
        const handler = (data) => {
          const json = new TextDecoder().decode(data);
          const newData = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
          const newDiv = document.createElement('div');
          this.demo_output.appendChild(newDiv);
          newDiv.textContent = json;
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
          <Row>
            <Col xs="12" sm="6" lg="3">
              <h3>Raspberry Pi</h3>
              <h1>{this.state.rpi}</h1>
            </Col>
            <Col xs="12" sm="6" lg="3">
            </Col>
            <Col xs="12" sm="6" lg="3">
            </Col>
            <Col xs="12" sm="6" lg="3">
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

