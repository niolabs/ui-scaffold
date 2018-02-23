import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, Loader } from '@nio/ui-kit';
import { isAuthenticated, login } from '../util/auth';
import { getSystems, getPubkeeper, setPubkeeper, fetchPubkeeperServers, staticPubkeeper } from '../util/pubkeeper';

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
    const pk = getPubkeeper();
    const staticPk = staticPubkeeper();
    const pkOK = pk && pk.PK_HOST && pk.PK_JWT && pk.WS_HOST;

    if (!pkOK) {
      if (isAuthenticated() && !staticPk) {
        if (!isOpen) openConfig();
        if (!this.fetching) {
          this.fetching = true;
          fetchPubkeeperServers().then(e => !e && this.forceRender());
        }
      } else if (staticPk && !pkOK && !isOpen) {
        openConfig();
      } else {
        login();
      }
    }
  }

  onUpdate() {
    const { openConfig, isOpen } = this.props;
    const pk = getPubkeeper();
    const staticPk = staticPubkeeper();
    const pkOK = pk && pk.PK_HOST && pk.PK_JWT && pk.WS_HOST;

    if (!staticPk && isOpen && !getSystems()) {
      if (isAuthenticated()) {
        this.fetching = true;
        fetchPubkeeperServers().then(e => !e && this.forceRender());
      } else {
        login();
      }
    } else if (staticPk && !pkOK && !isOpen) {
      openConfig();
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
    const staticPk = staticPubkeeper();
    const pkOK = pk && pk.PK_HOST && pk.PK_JWT && pk.WS_HOST;

    return (
      <Modal isOpen={isOpen}>
        <ModalHeader>Pubkeeper Server Details</ModalHeader>
        { pkOK ? (
          <div id="pkDetails" className="text-nowrap pt-3 pl-3 pr-3 pb-0">
            <b>PK_HOST:</b> {pk.PK_HOST}<br />
            <b>PK_JWT:</b> {pk.PK_JWT}&nbsp;&nbsp;&nbsp;
            <hr className="mb-0" />
          </div>
        ) : !staticPk ? (
          <div className="pt-3 text-center">
            You do not seem to have configured your Pubkeeper server.<br />
            Please select one from the list below.
            <hr className="mb-0" />
          </div>
        ) : (
          <div className="pt-3 text-center">
            You do not seem to have configured your static Pubkeeper server.<br />
            Please open <i className="text-danger">config.js</i> at the project root and add server details, or change <i className="text-danger">staticPubkeeper</i> to <b>false</b> to select a cloud Pubkeeper server.
            <hr className="mb-0" />
          </div>
        )}
        <div className="p-3">
          { staticPk ? (
            pkOK && (
              <div className="text-center pt-0">
                Your UI is configured to use the static Pubkeeper configuration details above.<br />
                Please open <i className="text-danger">config.js</i> at the project root to modify these value, or change <i className="text-danger">staticPubkeeper</i> to <b>false</b> to select a cloud Pubkeeper server.
                <hr className="mb-3 mt-3" />
              </div>
            )
          ) : systems && Object.keys(systems).length ? Object.keys(systems).map(uuid => systems[uuid].pk_host && systems[uuid].pk_token && (
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
