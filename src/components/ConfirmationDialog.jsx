import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFirestore } from 'react-redux-firebase'
import { Delete } from '@material-ui/icons'

import './ConfirmationDialogue.scss'
export default function ConfirmationDialogue({id, visible}) {
  const [open, setOpen] = React.useState(visible);

  const handleOpen = () => {
    setOpen(true);
  };  

  const handleDisagree = () => {
    setOpen(false);
  };  

  const handleAgree = () => {
        if(open)
            firestore.delete(id)
  };


  const firestore = useFirestore();


  return (
    <div>
        <Button 
            className="closeButton" 
            onClick={handleOpen}  
            variant="contained" 
            color="secondary" 
            size="small" 
            startIcon={<Delete/>}
            >

       
            Delete
        </Button>
        

      <Dialog
        open={open}
        onClose={handleDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Data?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete data?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree} color="primary">
            Disagree
          </Button>
          <Button onClick={handleAgree} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}