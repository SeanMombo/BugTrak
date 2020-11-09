import React from 'react';
import { useSelector } from 'react-redux'
import { useFirebase } from 'react-redux-firebase'

import {
  HeaderContainer,

  OptionsContainer,
  OptionLink,
  HeaderContainerWrapper
} from './header.styles';

const Header = () => {
  const auth = useSelector(state => state.firebase.auth)
  const firebase = useFirebase();

  return (
  <HeaderContainerWrapper>

    <HeaderContainer square elevation={1}>
      
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
