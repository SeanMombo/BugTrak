import React, { useEffect }  from 'react'
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

import './App.css'

// import BackButton from './components/BackButton'
import ControlPanel from './components/ControlPanel/control-panel.component'
import Header from './components/Header/header.component'

import AdminPage from './pages/AdminPage.jsx'
import ProjectPage from './pages/ProjectPage'
import TicketPage from './pages/TicketPage'
import LoginPage from './pages/LoginPage'


function PrivateRoute({ children, ...rest }) {
  const auth = useSelector(state => state.firebase.auth)
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoaded(auth) && !isEmpty(auth) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}


// Create store with reducers and initial state
const store = configureStore({
  reducer,
  initialState, 
  devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
})


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




// Setup react-redux so that connect HOC can be used
function App() {



  useEffect(() => {

    store.dispatch(fetchUsersStartAsync());
  })

  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
      
      {/* <Test/> */}
        <Router>
        <ControlPanel/>
          
          <Header/>
          
          <div className='App'>
            <div className='appWrapper'>

              <Switch>
              
                <Route path="/login">
                  <LoginPage />
                </Route>

                <PrivateRoute  path="/admin">
                  <AdminPage />

                </PrivateRoute>

                <PrivateRoute  path="/project/:projectId">
                  <ProjectPage />
                </PrivateRoute>
                
                <PrivateRoute  path="/ticket/:ticketId">
                  <TicketPage />
                </PrivateRoute>
                
                <PrivateRoute path="/">
                </PrivateRoute>
              </Switch>
            </div>
          </div>
        </Router>
        
      </ReactReduxFirebaseProvider>
    </Provider>
  )
}

export default App;



