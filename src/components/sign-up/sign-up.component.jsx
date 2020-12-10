import React, { useState } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import FormInput from '../form-input/form-input.component';
// import CustomButton from '../custom-button/custom-button.component';
import Button from '@material-ui/core/Button'

import { SignUpContainer, SignUpTitle } from './sign-up.styles';

import { toggleSnackbar } from '../../redux/tableSlice';
import { userTypes, userConversion } from '../../constants'
import './sign-up.scss';
const SignUp = () => {
  const [userCredentials, setUserCredentials] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { displayName, email, password, confirmPassword } = userCredentials;

  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();


  const handleSubmit = async event => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("passwords don't match");
      return;
    }
    // signUpStart(displayName, email, password, confirmPassword);
    const credentials = {
      email: email,
      password: password,
      displayName: displayName,
     
    };
    const profile = {
      email: email,
      displayName: displayName,
      userType: userTypes[userConversion.submitter],
      dateCreated: firestore.Timestamp.fromDate(new Date()),
      guest: true,
    };

    try {
      await firebase.createUser(credentials, profile);

    } catch(error) {
      dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
      return;
    }
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setUserCredentials({...userCredentials, [name]: value });
  };

  async function handleGuestLogin1(event) {
    event.preventDefault();
    const email = 'admin@guest.com'

    firebase.login({ email: email, password: 'test123'}).catch((error) => {
        dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
    })
};



  return (
    <SignUpContainer>
      <SignUpTitle>I do not have a account</SignUpTitle>
      <span>Sign up with your email and password</span>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <FormInput
          type='text'
          name='displayName'
          value={displayName}
          onChange={handleChange}
          label='Display Name'
          required
        />
        <FormInput
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          label='Email'
          required
        />
        <FormInput
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          label='Password'
          required
        />
        <FormInput
          type='password'
          name='confirmPassword'
          value={confirmPassword}
          onChange={handleChange}
          label='Confirm Password'
          required
        />
        {/* <CustomButton type='submit'>SIGN UP</CustomButton> */}
        <Button 
          variant="contained"
          color="primary"
          style={{width:120, height:50, borderRadius:0, backgroundColor:'black'}}
          type="submit"> 

          SIGN UP
        </Button>
        
        <Button  
        onClick={handleGuestLogin1}
        variant="contained"
        color="primary"
        style={{width:220, height:50, borderRadius:0, backgroundColor:'#4288EF', marginRight:'-15px', float:'right'}}
        > 
            Sign In As Guest
        </Button>
  
      </form>
      
    </SignUpContainer>
  );
}


// const mapDispatchToProps = dispatch => ({
//   signUpStart: (displayName, email, password, confirmPassword) => dispatch(signUpStart({displayName, email, password, confirmPassword}))
// })

// export default connect(null, mapDispatchToProps)(SignUp);
export default SignUp;


