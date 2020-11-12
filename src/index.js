import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider, useSelector, useDispatch } from 'react-redux'
import reducer, { initialState } from './redux/reducers';
import { configureStore } from '@reduxjs/toolkit'

import 'firebase/auth'
import 'firebase/firestore' // <- needed if using firestore
import {
  ReactReduxFirebaseProvider,
  isLoaded, isEmpty,
} from 'react-redux-firebase'

import { createFirestoreInstance } from 'redux-firestore' // <- needed if using firestore
import firebase from './firebase.utils'
import { fetchUsersStartAsync } from './redux/usersSlice'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";





// ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// Create store with reducers and initial state
const store = configureStore({
    reducer,
    initialState, 
    devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  })
  
  
  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./redux/reducers', () => {
        store.replaceReducer(reducer);
      });
    }
  }
  // react-redux-firebase config
  const rrfConfig = {
      userProfile: 'users',
      useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
      allowMultipleListeners: true,
  }
  
  const rrfProps = {
    firebase,
    enableLogging: true,
    logErrors: true,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance // <- needed if using firestore
  }
  

  
const render = Component => {
    

    store.dispatch(fetchUsersStartAsync());
     
   

    return ReactDOM.render(
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <Router>
                    <Component />
                </Router>
            </ReactReduxFirebaseProvider>
        </Provider>,
      document.getElementById('root')
    );
  };


  render(App);

  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default;
      render(NextApp);
    });
  }
