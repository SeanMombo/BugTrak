import React, { Component } from 'react'
import {useHistory} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import './BackButton.scss';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
function BackButton() {

  const history = useHistory();

  const handleBack = () => {
    history.goBack();
  }
  
  return (
    <>
      <Button 
      className="backButton" 
      onClick={handleBack}  
      variant="contained" 
      // color="secondary" 
      size="small" 
      startIcon={<ArrowBackIcon/>}
      >
      Back
      </Button> 
      <br/><br/>
    </>
  )
}



export default (BackButton)
