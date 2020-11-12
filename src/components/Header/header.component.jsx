import React from 'react';
import { useSelector } from 'react-redux'
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'
import Typography from '@material-ui/core/Typography'
import {
  HeaderContainer,

  OptionsContainer,
  OptionLink,
  HeaderContainerWrapper
} from './header.styles';

const Header = () => {
  const auth = useSelector(state => state.firebase.auth)
  const profile = useSelector(state => state.firebase.profile)
  const firebase = useFirebase();

  
  return (
  <HeaderContainerWrapper>

    <HeaderContainer square elevation={1}>
          {isLoaded(auth, profile) && !isEmpty(auth, profile) ? (
           
              <p>
                Your Role: <b>{profile.userType.toUpperCase()}</b>
              </p>
          
          ) : (
            <></>
          )}

        <OptionsContainer>
          {/* <OptionLink to='/shop'>SHOP</OptionLink>
          <OptionLink to='/shop'></OptionLink> */}
        
          {auth.uid ? (
            <OptionLink to='/signout' onClick={firebase.logout}>
              SIGN OUT
            </OptionLink>
          ) : (
            <OptionLink to='/signin'>SIGN IN</OptionLink>
          )}
        
        </OptionsContainer>
            
    </HeaderContainer>
    {/* <Divider/> */}
  </HeaderContainerWrapper>
)};



export default Header;
