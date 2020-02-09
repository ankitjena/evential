import React from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import './App.css';
import rootReducer from './helpers/rootReducer';
import Navbar from './common/Navbar'

const store = createStore(rootReducer, applyMiddleware(thunk))

const App = () => {
  return (
    <Provider store={store}>
      <Navbar />
    </Provider>
  );
}

export default App;
