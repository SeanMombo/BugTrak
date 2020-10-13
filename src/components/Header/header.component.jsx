import React from 'react';



import {
  HeaderContainer,

  OptionsContainer,
  OptionLink,
  HeaderContainerWrapper
} from './header.styles';

const Header = ({ currentUser,}) => (
  <HeaderContainerWrapper>

    <HeaderContainer square elevation={0}>
      
        
      
        <OptionsContainer>
          <OptionLink to='/shop'></OptionLink>
          <OptionLink to='/shop'></OptionLink>
          {currentUser ? (
            <OptionLink as='div'>
              SIGN OUT
            </OptionLink>
          ) : (
            <OptionLink to='/signin'></OptionLink>
          )}
        
        </OptionsContainer>
            
    </HeaderContainer>
    {/* <Divider/> */}
  </HeaderContainerWrapper>
);



export default Header;
