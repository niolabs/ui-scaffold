import React from 'react';
import { Switch, Route } from 'react-router';

import Page1 from '../pages/home';

const Routes = () => (
  <Switch>
    <Route exact component={Page1} path="/" />
  </Switch>
);

export default Routes;
