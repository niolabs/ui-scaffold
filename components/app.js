import React from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse, NavLink as DumbNavLink } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import Routes from './routes';

import ConfigModal from './configModal';
import '../assets/app.scss';

import { isAuthenticated, authRequired, handleAuthentication, getPkServers, login, logout } from '../util/auth';
import { setPubkeeper, getPubkeeper, getSystems } from '../util/storage';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { navOpen: false, configOpen: false };
    const fns = ['toggleNav', 'openConfig', 'setPubkeeperServer'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    if (window.location.search.indexOf('authorize=true') >= 0) {
      handleAuthentication().then(() => {
        if (!getPubkeeper()) {
          this.openConfig();
        } else {
          setTimeout(window.location.reload());
        }
      });
    } else if (!isAuthenticated() && authRequired()) {
      login();
    } else if (!getPubkeeper()) {
      this.openConfig();
    }
  }

  setPubkeeperServer(uuid) {
    this.setState({ configOpen: false });
    setPubkeeper(uuid);
    setTimeout(window.location.reload());
  }

  openConfig() {
    if (!getSystems()) {
      getPkServers().then(() => this.setState({ configOpen: true }));
    }
    this.setState({ configOpen: true });
  }

  toggleNav(close) {
    this.setState({ navOpen: close ? false : !this.state.navOpen });
  }

  render() {
    const { navOpen, configOpen } = this.state;
    const pk = getPubkeeper();
    const auth = isAuthenticated();
    const authrequired = authRequired();

    return (auth || !authrequired) ? (
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
                <DumbNavLink onClick={() => this.openConfig()}>Config</DumbNavLink>
              </NavItem>
              { auth && (
                <NavItem>
                  <DumbNavLink onClick={() => logout()}>Log Out</DumbNavLink>
                </NavItem>
              )}
            </Nav>
          </Collapse>
        </Navbar>
        <div id="app-container">
          { pk && (<Routes />)}
        </div>
        <ConfigModal
          hasPubkeeper={pk !== null}
          isOpen={configOpen}
          setPubkeeperServer={this.setPubkeeperServer}
        />
      </div>
    ) : null;
  }
}

export default App;
