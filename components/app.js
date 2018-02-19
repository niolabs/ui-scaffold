import React from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse, NavLink as DumbNavLink } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import Routes from './routes';

import ConfigModal from './configModal';
import '../assets/app.scss';

import { isAuthenticated, handleAuthentication, getPkServers, login, logout } from '../util/auth';
import { setPubkeeper, getPubkeeper, getSystems } from '../util/storage';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { navOpen: false, configOpen: false };
    const fns = ['toggleNav', 'openModal', 'setPubkeeperServer'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    if (window.location.search.indexOf('authorize=true') >= 0) {
      handleAuthentication().then(() => {
        if (!getSystems()) {
          getPkServers().then(this.openModal());
        } else if (!getPubkeeper()) {
          this.openModal();
        } else {
          setTimeout(window.location.reload());
        }
      });
    } else if (!isAuthenticated()) {
      login();
    } else if (!getSystems()) {
      getPkServers().then(this.openModal());
    } else if (!getPubkeeper()) {
      this.openModal();
    }
  }

  setPubkeeperServer(uuid) {
    this.setState({ configOpen: false });
    setPubkeeper(uuid);
    setTimeout(window.location.reload());
  }

  openModal() {
    this.setState({ configOpen: true });
  }

  toggleNav(close) {
    this.setState({ navOpen: close ? false : !this.state.navOpen });
  }

  render() {
    const { navOpen, configOpen } = this.state;
    const pk = getPubkeeper();
    const auth = isAuthenticated();

    return auth ? (
      <div>
        <Navbar id="app-nav" dark fixed="top" expand="md">
          <div className="navbar-brand">
            <NavLink to="/"><div id="logo" /></NavLink>
          </div>
          <NavbarToggler right onClick={() => this.toggleNav()} isOpen={navOpen} />
          <Collapse isOpen={navOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={() => this.toggleNav(true)} to="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={() => this.toggleNav(true)} to="/page2">Page 2</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={() => this.toggleNav(true)} to="/page3">Page 3</NavLink>
              </NavItem>
              <NavItem>
                <DumbNavLink onClick={() => this.openModal()}>Config</DumbNavLink>
              </NavItem>
              <NavItem>
                <DumbNavLink onClick={() => logout()}>Log Out</DumbNavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <div id="app-container">
          { pk && (<Routes />)}
        </div>
        <ConfigModal
          hasPubkeeper={getPubkeeper() !== null}
          isOpen={configOpen}
          setPubkeeperServer={this.setPubkeeperServer}
        />
      </div>
    ) : null;
  }
}

export default App;
