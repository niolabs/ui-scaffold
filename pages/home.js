import React, { Component } from 'react';
import { Card, CardBody, Clock, Row, Col, Button } from '@nio/ui-kit';
import { withPubkeeper } from '../providers/pubkeeper';

class Page extends Component {
  state = { currentTime: new Date(), historicalTime: [], brewedTime: new Date(), historicalBrewedTime: [] };

  componentDidMount = () => {
    const { pkClient } = this.props;
    pkClient.addPatron('ui_scaffold.example_brew', patron => patron.on('message', this.writeDataToState));
    pkClient.addBrewer('ui_scaffold.example_brew2', brewer => this.brewer = brewer);
    pkClient.addPatron('ui_scaffold.example_brew2', patron => patron.on('message', this.writeDataToState2));
  };

  writeDataToState = (data) => {
    const { historicalTime } = this.state;

    const json = new TextDecoder().decode(data);
    const { time } = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    const currentTime = new Date(time);
    historicalTime.unshift(currentTime.toLocaleString());
    this.setState({ currentTime, historicalTime });
  };

  writeDataToState2 = (data) => {
    const { historicalBrewedTime } = this.state;

    const json = new TextDecoder().decode(data);
    const { newBrewedTime } = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    const brewedTime = new Date(newBrewedTime);
    historicalBrewedTime.unshift(brewedTime.toLocaleString());
    this.setState({ brewedTime, historicalBrewedTime });
  };

  brewCurrentTimestamp = () => {
    this.brewer.brewJSON([{ newBrewedTime: new Date() }]);
  };

  render() {
    const { currentTime, historicalTime, brewedTime, historicalBrewedTime } = this.state;

    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">UI Scaffold / Pubkeeper Demo</h2>
          Sending signals to and receiving signals from nio services using the Pubkeeper javascript client.
          <hr />
          <Row>
            <Col md="4">
              <b>The Pubkeeper Provider is a HoC that uses React&apos;s Context API to:</b>
              <ul>
                <li>Connect to the Pubkeeper Server</li>
                <li>Publish the time every second to <i>ui_scaffold.example_brew</i></li>
                <li>Inject the connected pkClient via the <i>withPubkeeper</i> method</li>
              </ul>
            </Col>
            <Col xs="12" className="d-inline-block d-md-none">
              <hr />
            </Col>
            <Col md="4">
              <b>The left side uses the pkClient to:</b>
              <ul>
                <li>Create a Patron of <i>ui_scaffold.example_brew</i></li>
                <li>Assign inbound signals on that topic to an event handler <i>writeDataToState</i></li>
                <li>Update the Clock and historical array based on updated local state</li>
              </ul>
            </Col>
            <Col xs="12" className="d-inline-block d-md-none">
              <hr />
            </Col>
            <Col md="4">
              <b>The right side uses the pkClient to:</b>
              <ul>
                <li>Create a new Brewer <i>and</i> new Patron for topic <i>ui_scaffold.example_brew2</i></li>
                <li>Brew the current time when you click the button</li>
                <li>Assign inbound signals on that topic to an event handler <i>writeDataToState2</i></li>
              </ul>
            </Col>
          </Row>
          <hr className="my-3" />
          <Row>
            <Col md="3" sm="6" className="text-center mb-3 text-nowrap">
              <Clock value={currentTime} />
            </Col>
            <Col md="3" sm="6">
              <div id="demo_output">
                {historicalTime && historicalTime.map(h => (<div key={h}>{h}</div>))}
              </div>
            </Col>
            <Col xs="12" className="d-inline-block d-md-none">
              <hr />
            </Col>
            <Col md="3" sm="6" className="text-center mb-3 text-nowrap">
              <Clock value={brewedTime} />
            </Col>
            <Col md="3" sm="6">
              <Button block color="primary" onClick={() => this.brewCurrentTimestamp()}>Brew Current Time</Button>
              <div id="demo_output_2">
                {historicalBrewedTime && historicalBrewedTime.map((h, i) => (<div key={i}>{h}</div>))}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default withPubkeeper(Page);
