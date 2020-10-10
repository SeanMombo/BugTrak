import React from 'react';



import {
  HeaderContainer,

  OptionsContainer,
  OptionLink,
  HeaderContainerWrapper
} from './header.styles';

const Header = ({ currentUser, signOutStart }) => (
  <HeaderContainerWrapper>

  <HeaderContainer square elevation={1}>
    
      <h1>BugTrak</h1>
    
      <OptionsContainer>
        <OptionLink to='/shop'>SHOP</OptionLink>
        <OptionLink to='/shop'>CONTACT</OptionLink>
        {currentUser ? (
          <OptionLink as='div' onClick={signOutStart}>
            SIGN OUT
          </OptionLink>
        ) : (
          <OptionLink to='/signin'>SIGN IN</OptionLink>
        )}
      
      </OptionsContainer>
          
  </HeaderContainer>
  {/* <Divider/> */}
  </HeaderContainerWrapper>
);



export default Header;
