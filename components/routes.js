import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from '../pages/home';

const Routes = () => (
  <Switch>
    <Redirect from="/" exact to="/home" />
    <Route component={HomePage} path="/home" />
  </Switch>
);

export default Routes;
