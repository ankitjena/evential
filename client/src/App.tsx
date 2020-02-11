import React, { useEffect } from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { AppState } from './helpers/rootReducer';
import Home from './home/Home';
import './App.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import { useSelector, Provider, useDispatch } from 'react-redux';
import {
  ProtectedRoute,
  ProtectedRouteProps
} from './components/ProtectedRoutes';
import { check } from './auth/actions';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store: any;
  }
}

const store = createStore(rootReducer, applyMiddleware(thunk));

window.store = store || {};

const AppRoutes = () => {
  const authState = useSelector((state: AppState) => state.AuthReducer);
  const dispatch = useDispatch();
  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated: authState.isAuthenticated,
    authenticationPath: '/auth/login'
  };

  console.log(authState);

  useEffect(() => {
    dispatch(check());
    console.log('check called');
  }, []);

  return (
    <Router>
      <Switch>
        <ProtectedRoute
          {...defaultProtectedRouteProps}
          exact
          path="/"
          component={Home}
        />
        <Route
          exact
          path="/auth/login"
          render={routeProps => <Login {...routeProps} />}
        />
        <Route
          exact
          path="/auth/register"
          render={routeProps => <Register {...routeProps} />}
        ></Route>
      </Switch>
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
