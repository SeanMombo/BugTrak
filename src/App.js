import React from 'react'
import { Provider, useSelector } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore' // <- needed if using firestore
import {

  ReactReduxFirebaseProvider,
  isLoaded, isEmpty,

} from 'react-redux-firebase'

import { createFirestoreInstance } from 'redux-firestore' // <- needed if using firestore
import reducer, { initialState } from './redux/reducers';
import { configureStore } from '@reduxjs/toolkit'

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
// import SimpleModal from './components/Modal/Modal'

// import Todos from './components/Todos'
// import NewTodo from './components/NewTodo'
// import ManageUsers from './pages/ManageUsersPage'
import AdminPage from './pages/AdminPage.jsx'
// import ManageProjectsPage from './pages/ManageProjectsPage'
import ProjectPage from './pages/ProjectPage'
import TicketPage from './pages/TicketPage'
import LoginPage from './pages/LoginPage'
// import SimpleTabs from './pages/SimpleTabs'

const firebaseConfig = {
  apiKey: "AIzaSyC7J1Jfu8DnMaKYK7XZmwymosz5w5xpluM",
  authDomain: "bugtrak-ff53f.firebaseapp.com",
  databaseURL: "https://bugtrak-ff53f.firebaseio.com",
  projectId: "bugtrak-ff53f",
  storageBucket: "bugtrak-ff53f.appspot.com",
  messagingSenderId: "829003961471",
  appId: "1:829003961471:web:708f796070d53e1a49db4a",
  measurementId: "G-TFB7THVC8J"
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  allowMultipleListeners: true,
 
}

// Initialize firebase instance
firebase.initializeApp(firebaseConfig)

// Initialize other services on firebase instance
firebase.firestore() // <- needed if using firestore

// Create store with reducers and initial state
const store = configureStore({
  reducer,
  initialState, 
  devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()})

const rrfProps = {
  firebase,
  enableLogging: true,
  logErrors: true,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
}

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


// Setup react-redux so that connect HOC can be used
function App() {



  
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
                  {/* <SimpleTabs/> */}
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



