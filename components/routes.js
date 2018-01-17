import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Page1 from '../pages/home';
import Page2 from '../pages/page2';
import Page3 from '../pages/page3';

const Routes = () => (
  <Switch>
    <Route exact component={Page1} path="/" />
    <Route exact component={Page2} path="/page2" />
    <Route exact component={Page3} path="/page3" />
  </Switch>
);

export default Routes;
