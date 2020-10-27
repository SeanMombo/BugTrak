import React from 'react'
// import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'
// import GoogleButton from 'react-google-button' // optional
import {

  Redirect,

} from "react-router-dom";


function LoginPage () {
  const firebase = useFirebase()
  const auth = useSelector(state => state.firebase.auth)

  function loginWithGoogle() {
    return firebase.login({ provider: 'google', type: 'popup' })
  }

  return (
    <div >
      <div>
        <h2>Auth</h2>
        {
          !isLoaded(auth)
          ? <span>Loading...</span>
          : isEmpty(auth)
            // <GoogleButton/> button can be used instead
            ? <button onClick={loginWithGoogle}>Login With Google</button>
            : <Redirect
            to={{
              pathname: "/",

            }}
          />
        }
      </div>
    </div>
  )
}

export default LoginPage