import React from 'react';
import { Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Collapse } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import Auth from './auth';
import config from '../config';
import Routes from './routes';
import LoginPage from '../pages/login';
import '../assets/app.scss';

const AUTH = config.APP_REQUIRES_LOGIN ? new Auth(config.AUTH0_ACCT, config.AUTH0_URL) : false;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    const fns = ['toggle'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  toggle(close) {
    this.setState({ isOpen: close ? false : !this.state.isOpen });
  }

  render() {
    return (
      <div>
        <Navbar id="app-nav" dark fixed="top" expand="md">
          <NavbarBrand><div id="logo" /></NavbarBrand>
          <NavbarToggler right onClick={() => this.toggle()} isOpen={this.state.isOpen} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={() => this.toggle(true)} to="/demo">Demo</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={() => this.toggle(true)} to="/arch">Architecture</NavLink>
              </NavItem>
              { AUTH && AUTH.loggedIn() && (
                <NavItem>
                  <NavLink onClick={() => AUTH.logout()} to="/">Log Out</NavLink>
                </NavItem>
              )}
            </Nav>
          </Collapse>
        </Navbar>
        <div id="app-container">
          {((AUTH && AUTH.loggedIn()) || !AUTH) ? (
            <Routes />
          ) : (
            <LoginPage />
          )}
        </div>
      </div>
    );
  }
}

export default App;
