import React, { Component } from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import '../assets/app.scss';
import Routes from './routes';

class App extends Component {
  state = { navOpen: false };

  render = () => {
    const { navOpen } = this.state;

    return (
      <div>
        <Navbar id="app-nav" dark fixed="top" expand="md">
          <div className="navbar-brand">
            <NavLink to="/"><div id="logo" /></NavLink>
          </div>
          <NavbarToggler right onClick={() => this.setState({ navOpen: !navOpen })} isOpen={navOpen} />
          <Collapse isOpen={navOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={() => this.setState({ navOpen: false })} exact to="/">Home</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <div id="app-container">
          <Routes />
        </div>
      </div>
    );
  }
}

export default App;
