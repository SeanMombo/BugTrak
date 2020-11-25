import React from 'react'

import { useSelector } from 'react-redux'

import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'


// import { isMobile } from 'react-device-detect';

import {
  Redirect,
} from "react-router-dom";
// import Paper from '@material-ui/core/Paper'
import './LoginPage.scss'

import SignInAndSignUp from '../components/sign-in-and-sign-up/sign-in-and-sign-up.component'


function LoginPage () {
  const firebase = useFirebase();
  const auth = useSelector(state => state.firebase.auth);


  // function loginWithGoogle() {
  //   if(isMobile)
  //     return firebase.login({ provider: 'google', type: 'redirect' })
  //   else
  //     return firebase.login({ provider: 'google', type: 'popup' })
  // }

  return (
    <div className='loginPage'>
      {/* <div>
        <h2>Auth</h2>
        {
          !isLoaded(auth)
          ? <span>Loading...</span>
          : isEmpty(auth)
            // <GoogleButton/>
            ? <button onClick={loginWithGoogle}>Login With Google</button>
            : <Redirect
            to={{
              pathname: "/",

            }}
          />
        }
      </div> */}


        { !isLoaded(auth)
          ? <span>Loading...</span>
          : isEmpty(auth)

            ? <SignInAndSignUp/>
            : <Redirect
            to={{
              pathname: "/",

            }}
          />
        }

      
    </div>
  )
}

export default LoginPage