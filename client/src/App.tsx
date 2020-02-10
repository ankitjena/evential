import React from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './helpers/rootReducer';
import Home from './home/Home'
import './App.css'
import { 
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Login from './auth/Login';
import Register from './auth/Register';

const store = createStore(rootReducer, applyMiddleware(thunk))

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/auth/login">
            <Login />
          </Route>
          <Route exact path="/auth/register">
            <Register />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
