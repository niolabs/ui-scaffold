import React from 'react';
import { Card, CardBody } from '@nio/ui-kit';

export default class Page extends React.Component {
  render() {
    return (
      <Card>
        <CardBody className="p-3">
          <h2 className="m-0">Page 2</h2>
          <b>subhead</b>
          <hr className="my-3" />
        </CardBody>
      </Card>
    );
  }
}

