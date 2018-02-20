import React from 'react';
import { Switch, Route } from 'react-router';

import Page1 from '../pages/home';
import Page2 from '../pages/page2';
import Page3 from '../pages/page3';

const Routes = () => (
  <Switch>
    <Route component={Page2} path="/page2" />
    <Route component={Page3} path="/page3" />
    <Route component={Page1} path="/" />
  </Switch>
);

export default Routes;
