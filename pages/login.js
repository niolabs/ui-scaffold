import React from 'react';
import PropTypes from 'prop-types';

class Login extends React.Component {
  componentDidMount() {
    setTimeout(() => { this.props.auth.login(); }, 1000);
  }

  render() {
    return null;
  }
}

Login.propTypes = {
  auth: PropTypes.object,
};

export default Login;
