import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Modal, ModalHeader, Loader } from '@nio/ui-kit';
import { getSystems } from '../util/storage';

class ConfigModal extends React.Component {
  render() {
    const systems = getSystems();
    const { setPubkeeperServer, isOpen, hasPubkeeper, closeConfig } = this.props;

    return (
      <Modal isOpen={isOpen}>
        <ModalHeader>Choose Your Pubkeeper Server</ModalHeader>
        <div className="p-3">
          { systems ? Object.keys(systems).map(uuid => systems[uuid].pk_host && systems[uuid].pk_token && (
            <Row key={uuid}>
              <Col xs="6" sm="4" className="text-nowrap mb-2 text-center text-sm-left">
                {systems[uuid].org}
              </Col>
              <Col xs="6" sm="4" className="text-nowrap mb-2 text-center text-sm-left">
                {systems[uuid].name}
              </Col>
              <Col xs="12" sm="4">
                <Button
                  className="mb-3"
                  color="primary"
                  size="sm"
                  disabled={hasPubkeeper && systems[uuid].active}
                  block
                  onClick={() => setPubkeeperServer(uuid)}
                >
                  {hasPubkeeper && systems[uuid].active ? 'Active' : 'Choose'}
                </Button>
              </Col>
              <Col xs="12">
                <hr className="mb-3 mt-0" />
              </Col>
            </Row>
          )) : (
            <div style={{ position: 'relative' }}>
              <br /><br /><br /><br /><br />
              <Loader />
            </div>
          )}
          <br />
          <Button size="sm" color="secondary" block onClick={() => closeConfig()}>Cancel</Button>
        </div>
      </Modal>
    );
  }
}

ConfigModal.propTypes = {
  hasPubkeeper: PropTypes.bool.isRequired,
  setPubkeeperServer: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeConfig: PropTypes.func.isRequired,
};

export default ConfigModal;
