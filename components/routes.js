import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from '../pages/home';

const Routes = () => (
  <Switch>
    <Route exact component={HomePage} path="/" />
  </Switch>
);

export default Routes;
