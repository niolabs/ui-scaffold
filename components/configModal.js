import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, Loader } from '@nio/ui-kit';
import { isAuthenticated, login } from '../util/auth';
import { getSystems, getPubkeeper, setPubkeeper, fetchPubkeeperServers } from '../util/pubkeeper';

class ConfigModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const fns = ['forceRender', 'onMount', 'onUpdate'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    setTimeout(() => { this.onMount(); }, 1000);
  }

  componentDidUpdate() {
    this.onUpdate();
  }

  onMount() {
    const { openConfig, isOpen } = this.props;

    if (!getPubkeeper()) {
      if (isAuthenticated()) {
        if (!isOpen) openConfig();
        if (!this.fetching) {
          this.fetching = true;
          fetchPubkeeperServers().then(e => !e && this.forceRender());
        }
      } else {
        login();
      }
    }
  }

  onUpdate() {
    const { isOpen } = this.props;

    if (isOpen && !this.fetching) {
      if (isAuthenticated()) {
        this.fetching = true;
        fetchPubkeeperServers().then(e => !e && this.forceRender());
      } else {
        login();
      }
    }
  }

  forceRender() {
    this.fetching = false;
    this.setState(this.state);
  }

  render() {
    const { closeConfig, isOpen } = this.props;
    const systems = getSystems();
    const pk = getPubkeeper();

    return (
      <Modal isOpen={isOpen}>
        <ModalHeader>Choose Your Pubkeeper Server</ModalHeader>
        <div className="p-3">
          { systems && Object.keys(systems).length ? Object.keys(systems).map(uuid => systems[uuid].pk_host && systems[uuid].pk_token && (
            <div key={uuid}>
              <Button
                className="mb-3"
                outline={!pk || !systems[uuid].active}
                color="primary"
                block
                onClick={() => (!systems[uuid].active ? setPubkeeper(uuid) : closeConfig())}
              >
                {systems[uuid].org} &raquo; {systems[uuid].name}
              </Button>
              <hr className="mb-3 mt-0" />
            </div>
          )) : systems ? (
            <div className="text-center pt-3">
              No Systems Found.<br />
              <a href="https://designer.n.io" rel="noreferrer noopener" target="_blank">Click here to create one in the nio System Designer</a>
              <hr className="mb-3 mt-4" />
            </div>
          ) : (
            <div className="text-center p-4" style={{ position: 'relative' }}>
              <br /><br />
              <Loader />
            </div>
            )}
          <Button className="mt-2" color="secondary" block onClick={() => closeConfig()}>Cancel</Button>
        </div>
      </Modal>
    );
  }
}

ConfigModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  openConfig: PropTypes.func.isRequired,
  closeConfig: PropTypes.func.isRequired,
};

export default ConfigModal;
