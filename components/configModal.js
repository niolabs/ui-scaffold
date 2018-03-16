import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Loader, Icon, Row, Col } from '@nio/ui-kit';
import { isAuthenticated, login } from '../util/auth';
import { getSystems, setSystems, getPubkeeper, setPubkeeper, fetchPubkeeperServers, staticPubkeeper } from '../util/pubkeeper';

class ConfigModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fetching: false, fetchingError: false, setting: false };
    const fns = ['forceRender', 'onMount', 'onUpdate', 'getPubkeeperServers', 'setPubkeeperServer'];
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
          fetchPubkeeperServers()
            .then(e => !e && this.forceRender())
            .catch(e => this.setState({ fetching: false, fetchingError: e }));
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
    const { fetchingError } = this.state;

    const pk = getPubkeeper();
    const staticPk = staticPubkeeper();
    const pkOK = pk && pk.PK_HOST && pk.PK_JWT && pk.WS_HOST;

    if (!staticPk && isOpen && !getSystems() && !fetchingError) {
      if (isAuthenticated()) {
        this.fetching = true;
        fetchPubkeeperServers()
          .then(e => !e && this.forceRender())
          .catch(e => this.setState({ fetching: false, fetchingError: e }));
      } else {
        login();
      }
    } else if (staticPk && !pkOK && !isOpen) {
      openConfig();
    }
  }

  getPubkeeperServers() {
    if (isAuthenticated()) {
      this.setState({ fetching: true });
      setSystems(false);
      fetchPubkeeperServers()
        .then(e => !e && this.forceRender())
        .catch(e => this.setState({ fetching: false, fetchingError: e }));
    } else {
      login();
    }
  }

  setPubkeeperServer(uuid) {
    this.setState({ setting: true });
    setPubkeeper(uuid);
  }

  forceRender() {
    this.fetching = false;
    this.setState({ fetching: false, fetchingError: false });
  }

  render() {
    const { closeConfig, isOpen } = this.props;
    const { fetching, fetchingError, setting } = this.state;

    const systems = getSystems();
    const systemsOk = systems && Object.keys(systems).length;
    const pk = getPubkeeper();
    const staticPk = staticPubkeeper();
    const pkOK = pk && pk.PK_HOST && pk.PK_JWT && pk.WS_HOST;

    return (
      <Modal id="pkConfig" isOpen={isOpen}>
        <div className="p-3">
          <Row>
            <Col xs="5">
              <h4 className="modal-title text-nowrap">Pubkeeper</h4>
            </Col>
            <Col xs="7" className="text-right text-nowrap">
              { (!staticPk) && (
                <Button alt="reload" title="reload" className="pkAction" color="success" onClick={() => this.getPubkeeperServers()}>
                  <Icon color="white" name="revert" size="lg" />
                </Button>
              )}
              { (pkOK || (staticPk && pkOK)) && (
                <Button alt="close" title="close" className="pkAction ml-1" color="danger" onClick={() => closeConfig()}>
                  <Icon color="white" name="times" size="lg" />
                </Button>
              )}
            </Col>
          </Row>
        </div>
        <div>
          <hr className="m-0" />
        </div>
        { pkOK ? (
          <div id="pkDetails" className="text-nowrap p-3">
            <b>PK_HOST:</b> {pk.PK_HOST}<br />
            <b>PK_JWT:</b> {pk.PK_JWT}&nbsp;&nbsp;&nbsp;
          </div>
        ) : fetchingError ? (
          <div className="p-3 text-center">
            { fetchingError }<br />
            Please click the green reload button to try again.<br />
            If the error persists, please <a href="https://app.n.io/support" target="_blank" rel="noopener noreferrer">contact support</a>.
          </div>
        ) : !staticPk && systemsOk ? (
          <div className="p-3 text-center">
            You do not seem to have configured your Pubkeeper server.<br />
            Please select one from the list below.
          </div>
        ) : !staticPk && !systemsOk ? (
          <div className="p-3 text-center">
            No Systems Found.<br />
            <a href="https://designer.n.io" rel="noopener noreferrer" target="_blank">Click here to create one in the nio System Designer</a>
          </div>
        ) : staticPk && pkOK ? (
          <div className="p-3 text-center">
            Your UI is configured to use the static Pubkeeper configuration details above.<br />
            Please open <i className="text-danger">config.js</i> at the project root to modify these value, or change <i className="text-danger">staticPubkeeper</i> to <b>false</b> to select a cloud Pubkeeper server.
          </div>
        ) : staticPk && !pkOK ? (
          <div className="p-3 text-center">
            You do not seem to have configured your static Pubkeeper server.<br />
            Please open <i className="text-danger">config.js</i> at the project root and add server details, or change <i className="text-danger">staticPubkeeper</i> to <b>false</b> to select a cloud Pubkeeper server.
          </div>
        ) : null
        }
        { !staticPk && (
          <div className="p-3">
            { fetching || setting ? (
              <div className="text-center p-4" style={{ position: 'relative' }}>
                <br /><br /><br />
                <Loader />
              </div>
            ) : systemsOk ? Object.keys(systems).map(uuid => systems[uuid].pk_host && systems[uuid].pk_token && (
              <div key={uuid}>
                <Button
                  className="mb-3"
                  outline={!pk || !systems[uuid].active}
                  color="primary"
                  block
                  onClick={() => (!systems[uuid].active ? this.setPubkeeperServer(uuid) : closeConfig())}
                >
                  {systems[uuid].org} &raquo; {systems[uuid].name}
                </Button>
              </div>
            )) : !systems ? (
              <div className="text-center p-4" style={{ position: 'relative' }}>
                <br /><br /><br />
                <Loader />
              </div>
            ) : null
            }
          </div>
        )}
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
