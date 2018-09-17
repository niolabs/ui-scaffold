import React, { Component } from 'react';
import { Card, CardBody, Clock, Row, Col, Button } from '@nio/ui-kit';
import { withPubkeeper } from '../providers/pubkeeper';

class Page extends Component {
  state = { currentTime: false, historicalTime: [], fakeTime: new Date(), historicalFakeTime: [] };

  componentDidMount = async () => {
    const { pkClient } = this.props;
    pkClient.addPatron('ui_scaffold.example_brew', patron => patron.on('message', this.writeDataToOutput));
    pkClient.addBrewer('ui_scaffold.example_brew', brewer => this.brewer = brewer);
  };

  writeDataToOutput = (data) => {
    const { historicalTime, historicalFakeTime } = this.state;

    const json = new TextDecoder().decode(data);
    const { time, newFakeTime } = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    if (time) {
      const currentTime = new Date(time);
      historicalTime.unshift(currentTime.toLocaleString());
      this.setState({ currentTime, historicalTime });
    }
    if (newFakeTime) {
      const fakeTime = new Date(newFakeTime);
      historicalFakeTime.unshift(fakeTime.toLocaleString());
      this.setState({ fakeTime, historicalFakeTime });
    }
  };

  sendAFakeTimestamp = () => {
    this.brewer.brewJSON([{ newFakeTime: new Date() }]);
  };

  render() {
    const { currentTime, historicalTime, fakeTime, historicalFakeTime } = this.state;

    return (
      <Card>
        <CardBody className="p-3">
          <Row>
            <Col sm="6" xs="12">
              <h2 className="m-0">Home</h2>
              <b>Current Time:</b> {currentTime && currentTime.toLocaleString()}<br />
            </Col>
            <Col sm="6" xs="12" className="text-right mt-2">
              <Button color="primary" onClick={() => this.sendAFakeTimestamp()}>Send Fake Time</Button>
            </Col>
          </Row>
          <hr className="my-3" />
          <Row>
            <Col sm="3" xs="12">
              {currentTime && (<Clock value={currentTime} />)}
            </Col>
            <Col sm="3" xs="12">
              <div id="demo_output">
                {historicalTime && historicalTime.map((h, i) => (<div key={i}>{h}</div>))}
              </div>
            </Col>
            <Col sm="3" xs="12">
              {fakeTime && (<Clock value={fakeTime} />)}
            </Col>
            <Col sm="3" xs="12">
              <div id="demo_output">
                {historicalFakeTime && historicalFakeTime.map((h, i) => (<div key={i}>{h}</div>))}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default withPubkeeper(Page);
