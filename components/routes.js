import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from '../pages/home';
import ArchitecturePage from '../pages/arch';
import DemoPage from '../pages/demo';

const Routes = () => (
  <Switch>
    <Route exact component={HomePage} path="/" />
    <Route exact component={ArchitecturePage} path="/arch" />
    <Route exact component={DemoPage} path="/demo" />
  </Switch>
);

export default Routes;
