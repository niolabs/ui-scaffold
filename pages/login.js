import React from 'react';
import config from '../config';
import Auth from '../components/auth';

const AUTH = config.APP_REQUIRES_LOGIN ? new Auth(config.AUTH0_ACCT, config.AUTH0_URL) : false;

class Login extends React.Component {
  componentDidMount() {
    setTimeout(() => { AUTH.login(); }, 1000);
  }

  render() {
    return null;
  }
}

export default Login;
