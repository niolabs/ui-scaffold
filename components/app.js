import React from 'react';
import { Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Collapse } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import Routes from './routes';
import '../assets/app.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }
  toggle(close) {
    this.setState({ isOpen: close ? false : !this.state.isOpen });
  }

  render() {
    return (
      <div>
        <Navbar id="app-nav" color="inverse" fixed="top" dark expand="md">
          <NavbarBrand><div id="logo" /></NavbarBrand>
          <NavbarToggler right onClick={() => this.toggle()} isOpen={this.state.isOpen} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={() => this.toggle(true)} to="/demo">Demo</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={() => this.toggle(true)} to="/architecture">Architecture</NavLink>
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
