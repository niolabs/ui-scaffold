import React from 'react';
import kefir from 'kefir';
import { Card, CardBody } from '@nio/ui-kit';

import pubkeeper_client from '../components/pubkeeper_client';

export default class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {};

    const fns = [];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    this.demo_output = document.getElementById('demo_output');

    // let's create some stream. this could also be from a pubkeeper client subscription
    const stream = kefir.stream((emitter) => {
      let count = 0;
      emitter.emit(count);
      const intervalId = setInterval(() => {
        count += 1;
        if (count < 1000) {
          emitter.emit({ name: 'stream', value: count });
        } else {
          emitter.end();
        }
      }, 1000);
      return () => clearInterval(intervalId);
    });

    // connect to the pubkeeper server
    pubkeeper_client.connect().then(() => {
      // publish the count from our dummy stream to the your_brew socket room
      pubkeeper_client.addBrewer('scaffold_brew', (brewer) => {
        const sub = stream.observe({ value(message) { brewer.brewJSON([message]); } });
        return () => { sub.unsubscribe(); };
      });
      // subscribe/add a patron to our own brew to demonstrate how the cycle works
      pubkeeper_client.addPatron('scaffold_brew', (patron) => {
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

  render() {
    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">Home</h2>
          <b>subhead</b>
          <hr className="my-3" />
          <div id="demo_output" />
        </CardBody>
      </Card>
    );
  }
}

