import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppliedRoute from './components/AppliedRoute';
import PrivateAppliedRoute from './components/PrivateAppliedRoute';

import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Signup from './containers/Signup';
import ResetPassword from './containers/ResetPassword';
import Settings from './containers/Settings';
import ChangePassword from './containers/ChangePassword';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute 
      path="/"
      exact 
      component={Home} 
      props={childProps}
    />
    <AppliedRoute 
      path="/login" 
      exact 
      component={Login} 
      props={childProps}
     />
    <AppliedRoute 
      path="/signup" 
      exact
       component={Signup} 
      props={childProps} 
    />
    <AppliedRoute
      path="/login/reset"
      exact
      component={ResetPassword}
      props={childProps}
    />
    <PrivateAppliedRoute
      path="/user"
      exact
      component={Settings}
      props={childProps}
    />
    <AppliedRoute
      path="/user/changepassword"
      exact
      component={ChangePassword}
      props={childProps}
    />
    {/* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>
);
