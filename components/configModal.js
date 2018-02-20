import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Modal, ModalHeader, Loader } from '@nio/ui-kit';
import { getSystems } from '../util/storage';

class ConfigModal extends React.Component {
  render() {
    const systems = getSystems();
    const { setPubkeeperServer, isOpen, hasPubkeeper } = this.props;

    return (
      <Modal isOpen={isOpen}>
        <ModalHeader>Choose Your Pubkeeper Server</ModalHeader>
        <div className="p-4">
          <Row>
            <Col xs="4" className="text-nowrap">
              <b>organization</b>
            </Col>
            <Col xs="8" className="text-nowrap">
              <b>system</b>
            </Col>
            <Col xs="12">
              <hr className="my=1" />
            </Col>
          </Row>
          { systems ? Object.keys(systems).map(uuid => systems[uuid].pk_host && systems[uuid].pk_token && (
            <Row key={uuid}>
              <Col xs="4" className="text-nowrap pt-2">
                {systems[uuid].org}
              </Col>
              <Col xs="4" className="text-nowrap pt-2">
                {systems[uuid].name}
              </Col>
              <Col xs="4">
                <Button color="primary" disabled={hasPubkeeper && systems[uuid].active} block onClick={() => setPubkeeperServer(uuid)}>{hasPubkeeper && systems[uuid].active ? 'Active' : 'Choose'}</Button>
              </Col>
              <Col xs="12">
                <hr className="my=1" />
              </Col>
            </Row>
          )) : (
            <div className="p-4" style={{ position: 'relative' }}>
              <br /><br /><br /><br /><br />
              <Loader />
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

ConfigModal.propTypes = {
  hasPubkeeper: PropTypes.bool.isRequired,
  setPubkeeperServer: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ConfigModal;
