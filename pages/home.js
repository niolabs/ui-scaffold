import React from 'react';
import { Card, CardBody, Row, Col, Clock } from '@nio/ui-kit';

import pubkeeper_client from '../components/pubkeeper_client';

export default class Page extends React.Component {
  constructor() {
    super();
    this.state = {
      time: new Date(),
    };

    const fns = ['startBrewInterval', 'writeDataToOutput'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    const app = this;
    this.demo_output = document.getElementById('demo_output');

    // connect to the pubkeeper server
    pubkeeper_client.connect().then(() => {
      // publish the count from our dummy stream to the your_brew socket room
      pubkeeper_client.addBrewer('ui_scaffold.example_brew', (brewer) => { app.brewer = brewer; app.startBrewInterval(); });

      // subscribe/add a patron to our own brew to demonstrate how the cycle works
      pubkeeper_client.addPatron('ui_scaffold.example_brew', (patron) => {
        patron.on('message', app.writeDataToOutput);
        return () => { patron.off('message', app.writeDataToOutput); };
      });
    });
  }

  componentWillUnmount() {
    pubkeeper_client.disconnect();
    clearInterval(this.brewInterval);
  }

  writeDataToOutput(data) {
    const json = new TextDecoder().decode(data);

    // set the current time
    const time = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    this.setState({ time: new Date(time.time) });

    // append to list of all times
    const newDiv = document.createElement('div');
    this.demo_output.appendChild(newDiv);
    newDiv.textContent = json;
  }

  startBrewInterval() {
    this.brewInterval = setInterval(() => {
      const time = new Date();
      console.log('set', time);
      this.brewer.brewJSON([{ time }]);
    }, 1000);
  }

  render() {
    const { time } = this.state;

    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">Home</h2>
          <b>Current Time: {time.toLocaleString()}</b>
          <hr className="my-3" />
          <Row>
            <Col xs="12" sm="6">
              <div id="demo_output" />
            </Col>
            <Col xs="12" sm="6">
              <Clock value={time} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

