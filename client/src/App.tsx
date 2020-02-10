import React from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './helpers/rootReducer';
import Home from './home/Home'
import './App.css'

const store = createStore(rootReducer, applyMiddleware(thunk))

const App = () => {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}

export default App;
