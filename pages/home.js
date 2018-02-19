import React from 'react';

import { Card, CardBody, Row, Col, Clock } from '@nio/ui-kit';
import createPubkeeperClient from '../util/pubkeeper';
import { getPubkeeper } from '../util/storage';

export default class Home extends React.Component {
  constructor() {
    super();
    this.pubkeeper_client = createPubkeeperClient();
    this.state = { time: new Date() };
    this.clock = false;
    const fns = ['writeDataToOutput', 'clockRef', 'connectToPubkeeper'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    this.connectToPubkeeper();
  }

  componentWillUnmount() {
    if (this.pubkeeper_client) this.pubkeeper_client.disconnect();
    if (this.brewInterval) clearInterval(this.brewInterval);
  }

  connectToPubkeeper() {
    if (this.pubkeeper_client) {
      this.pubkeeper_client.connect().then(() => {
        this.pubkeeper_client.addBrewer('ui_scaffold.example_brew', (brewer) => {
          this.brewInterval = setInterval(() => brewer.brewJSON([{ time: new Date() }]), 1000);
          return () => clearInterval(this.brewInterval);
        });
        this.pubkeeper_client.addPatron('ui_scaffold.example_brew', (patron) => {
          patron.on('message', this.writeDataToOutput);
          return () => patron.off('message', this.writeDataToOutput);
        });
      });
    } else {
      setTimeout(() => {
        this.connectToPubkeeper();
      }, 500);
    }
  }

  writeDataToOutput(data) {
    const json = new TextDecoder().decode(data);
    const time = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);

    // set the current time (which updates the clock)
    if (this.clock) this.setState({ time: new Date(time.time) });

    // append to list of all times
    const newDiv = document.createElement('div');
    document.getElementById('demo_output').prepend(newDiv);
    newDiv.textContent = json;
  }

  clockRef(el) {
    this.clock = el;
  }

  render() {
    const { time } = this.state;
    const pkConfig = getPubkeeper();

    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">Home</h2>
          <b>Current Time:</b> {time.toLocaleString()}<br />
          <b>Pubkeeper Server:</b> {pkConfig ? pkConfig.PK_NAME : '-'}
          <hr className="my-3" />
          <Row>
            <Col xs="12" sm="6" className="mb-2 text-center">
              <Clock ref={this.clockRef} value={time} />
            </Col>
            <Col xs="12" sm="6">
              <div id="demo_output" />
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}
