import React from 'react';
import { Card, CardBody } from '@nio/ui-kit';

import pubkeeper_client from '../components/pubkeeper_client';

export default class Page extends React.Component {
  render() {
    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">Demo</h2>
          <b>subhead</b>
          <hr className="my-3" />
          <div id="demo_output" />
        </CardBody>
      </Card>
    );
  }
}

