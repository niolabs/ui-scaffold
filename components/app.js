import React from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import Routes from './routes';
import LoginPage from '../pages/login';
import '../assets/app.scss';

import auth from './auth';

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
    return ((auth && auth.loggedIn()) || !auth) ? (
      <div>
        <Navbar id="app-nav" dark fixed="top" expand="md">
          <div className="navbar-brand">
            <NavLink to="/"><div id="logo" /></NavLink>
          </div>
          <NavbarToggler right onClick={() => this.toggle()} isOpen={this.state.isOpen} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={() => this.toggle(true)} to="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={() => this.toggle(true)} to="/page2">Page 2</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={() => this.toggle(true)} to="/page3">Page 3</NavLink>
              </NavItem>
              { auth && auth.loggedIn() && (
                <NavItem>
                  <NavLink onClick={() => auth.logout()} to="/">Log Out</NavLink>
                </NavItem>
              )}
            </Nav>
          </Collapse>
        </Navbar>
        <div id="app-container">
          <Routes />
        </div>
      </div>
    ) : (
      <LoginPage auth={auth} />
    );
  }
}

export default App;
