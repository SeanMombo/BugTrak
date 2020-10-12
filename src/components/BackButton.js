import React, { Component } from 'react'
import {useHistory} from 'react-router-dom'


function BackButton() {

  const history = useHistory();

  const handleBack = () => {
    history.goBack();
  }
  
  return (
    <button
      
      onClick={handleBack}
    >
      Back
    </button >
  )
}



export default (BackButton)
