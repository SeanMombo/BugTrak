import React from 'react'
import { render } from 'react-dom'
import { Provider, useSelector } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore' // <- needed if using firestore
import { createStore, combineReducers, compose } from 'redux'
import {
  ReactReduxFirebaseProvider,
  firebaseReducer,
  isLoaded, isEmpty,

} from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore' // <- needed if using firestore
import reducer, { initialState } from './redux/reducers';
import { configureStore } from '@reduxjs/toolkit'



import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Redirect,
} from "react-router-dom";




import Todos from './components/Todos'
import NewTodo from './components/NewTodo'
import ManageUsers from './pages/ManageUsersPage'
import ManageProjects from './pages/ManageProjectsPage'
import ProjectPage from './pages/ProjectPage'
import TicketPage from './pages/TicketPage'
import LoginPage from './pages/LoginPage'


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
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
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
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/manageprojects">Project</Link>
              </li>

              <li> <Link to="/ticket">Ticket</Link></li>
             
            </ul>

            <Switch>

              <Route  path="/login">
                <LoginPage />
              </Route>

              <PrivateRoute  path="/manageprojects">
                <ManageProjects />
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
        </Router>
      </ReactReduxFirebaseProvider>
    </Provider>
  )
}

export default App;



