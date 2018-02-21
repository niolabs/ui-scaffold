import React from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse, NavLink as DumbNavLink } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import '../assets/app.scss';
import Routes from './routes';
import ConfigModal from './configModal';
import { isAuthenticated, authRequired, handleAuthentication, login, logout } from '../util/auth';
import { staticPubkeeper } from '../util/pubkeeper';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { navOpen: false, configOpen: false };
    const fns = ['toggleNav', 'openConfig', 'closeConfig', 'forceRender'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    if (window.location.search.indexOf('authorize=true') >= 0) {
      handleAuthentication().then(() => this.forceRender());
    } else if (!isAuthenticated() && authRequired()) {
      login();
    }
  }

  forceRender() {
    this.setState(this.state);
  }

  openConfig() {
    this.setState({ configOpen: true });
  }

  closeConfig() {
    this.setState({ configOpen: false });
  }

  toggleNav(close) {
    this.setState({ navOpen: close ? false : !this.state.navOpen });
  }

  render() {
    const { navOpen, configOpen } = this.state;
    const auth = isAuthenticated();
    const authrequired = authRequired();
    const staticPk = staticPubkeeper();

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
                <NavLink exact to="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink exact to="/page2">Page 2</NavLink>
              </NavItem>
              <NavItem>
                <NavLink exact to="/page3">Page 3</NavLink>
              </NavItem>
              {!staticPk && (
                <NavItem>
                  <DumbNavLink onClick={() => this.openConfig()} title="settings"><i className="fa fa-lg fa-gear" /></DumbNavLink>
                </NavItem>
              )}
              { authrequired && (
                auth ? (
                  <NavItem>
                    <DumbNavLink onClick={() => logout()} title="log out"><i className="fa fa-lg fa-sign-out" /></DumbNavLink>
                  </NavItem>
                ) : (
                  <NavItem>
                    <DumbNavLink onClick={() => login()} title="log in"><i className="fa fa-lg fa-sign-in" /></DumbNavLink>
                  </NavItem>
                )
              )}
            </Nav>
          </Collapse>
        </Navbar>
        <div id="app-container">
          <Routes />
        </div>
        {!staticPk && (
        <ConfigModal
          isOpen={configOpen}
          openConfig={this.openConfig}
          closeConfig={this.closeConfig}
        />
        )}
      </div>
    ) : null;
  }
}

export default App;
