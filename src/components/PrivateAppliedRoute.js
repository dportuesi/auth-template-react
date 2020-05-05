import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const PrivateAppliedRoute = ({ component: Component, props: cProps, ...rest }) => {

  // Add your own authentication on the below line.
  const isLoggedIn = cProps.isAuthenticated;

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} {...cProps}/>
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateAppliedRoute