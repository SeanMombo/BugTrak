import React, { useState } from 'react';
// import { connect } from 'react-redux'
import { useFirebase } from 'react-redux-firebase'
import { isMobile } from 'react-device-detect';

import FormInput from '../form-input/form-input.component'
import Button from '@material-ui/core/Button';
import GoogleButton from 'react-google-button'
// import { googleSignInStart, emailSignInStart } from '../../redux/user/user.actions';
import { toggleSnackbar } from '../../redux/tableSlice';
import { useDispatch } from 'react-redux'

import {
  SignInContainer,
  SignInTitle,
  ButtonsBarContainer
} from './sign-in.styles';

const SignIn = () => {
  const [userCredentials, setCredentials] = useState({email: '', password: ''});
  const { email, password } = userCredentials;
  const firebase = useFirebase();
  const dispatch = useDispatch();

  function loginWithGoogle() {
    if(isMobile)
      return firebase.login({ provider: 'google', type: 'redirect' })
    else
      return firebase.login({ provider: 'google', type: 'popup' })
  }


  const handleSubmit = async event => {
    event.preventDefault();
    // emailSignInStart(email, password);
    firebase.login({ email: email, password: password}).catch((error) => {
      dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
    })

  
  };

  const handleChange = event => {
    const { value, name } = event.target;

    setCredentials({...userCredentials, [name]: value });
  };

  
  return (
    <SignInContainer>
      <SignInTitle>I already have an account</SignInTitle>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <FormInput
          name='email'
          type='email'
          handleChange={handleChange}
          value={email}
          label='email'
          required
        />
        <FormInput
          name='password'
          type='password'
          value={password}
          handleChange={handleChange}
          label='password'
          required
        />
        <ButtonsBarContainer>

          <Button 
          
              variant="contained"
              color="primary"
              style={{width: 120, borderRadius: 0, backgroundColor:'black'}}
              type="submit"> 
              
            Sign in
          </Button>
          {/* <Button 
            variant="contained"
            color="primary"

            type="button" onClick={loginWithGoogle}>

            Sign in with Google
          </Button> */}
          <GoogleButton
            onClick={() => { loginWithGoogle() }}
          />
        </ButtonsBarContainer>
      </form>
    </SignInContainer>
  );
}


// const mapDispatchToProps = dispatch => ({
//   googleSignInStart: () => dispatch(googleSignInStart()),
//   emailSignInStart: (email, password) => dispatch(emailSignInStart({ email, password }))
// })

// export default connect(null, mapDispatchToProps)(SignIn);
export default (SignIn);
