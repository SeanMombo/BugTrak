import React from 'react'
import { useSelector} from 'react-redux'
import 'firebase/auth'
import 'firebase/firestore' // <- needed if using firestore

import {
  isLoaded, isEmpty,
} from 'react-redux-firebase'

import {
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
import MyProjects from './pages/MyProjectsPage'
import MyTickets from './pages/MyTicketsPage'

import Snackbar from './components/Snackbar'

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
  const auth = useSelector(state => state.firebase.auth);
  const noUser = isLoaded(auth) && isEmpty(auth);

  return (
      <>
        <ControlPanel/>
          
          <div className={noUser ? 'AppNoUser' : 'App'}>
            <Header/>
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

                <PrivateRoute  path="/myprojects">
                  <MyProjects />
                </PrivateRoute>

                <PrivateRoute  path="/mytickets">
                  <MyTickets />
                </PrivateRoute>

                <PrivateRoute path="/">
                </PrivateRoute>
              </Switch>
            </div>
          </div>
          <Snackbar/>
      </>
  )
}

export default App;
