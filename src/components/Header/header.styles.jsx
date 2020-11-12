import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

export const HeaderContainer = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  /* position:fixed; */
  z-index:-1;
  align-items: center;
  margin-bottom:24px;
  h1 {
    font-size: 40px;
    margin: 0;
    padding: 10px 15px;
  }
  p {
    padding: 10px 16px;
    min-width:200px;
    display:inline !important;

    b {
      display:inline !important;
    }
  }

  /* @media screen and (max-width: 800px) {
    height: 60px;
    padding: 10px;
    margin-bottom:60px;
  } */
`;
export const HeaderContainerWrapper = styled.div`
  /* margin-left: 230px; */
  /* margin-bottom: 32px; */
  `;

export const LogoContainer = styled(Link)`
  height: 100%;
  
  padding: 25px;

  /* @media screen and (max-width: 800px) {
    width: 50px;
    padding: 0;
  } */
`;

export const OptionsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  
  @media screen and (max-width: 800px) {
    width: 80%;
  }
`;

export const OptionLink = styled(Link)`
  padding: 10px 15px;
  cursor: pointer;
`;
