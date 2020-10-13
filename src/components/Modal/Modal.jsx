import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux'
import {toggleModal} from '../../redux/tableSlice'

function getModalStyle() {
  const top = 10;
  const left = 50;

  return {

    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${left}%, -${top}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    // width: '50%',
    position: 'absolute',
    
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modalStyle] = React.useState(getModalStyle);

  // const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    dispatch(toggleModal(true))
  };

  const handleClose = () => {
    dispatch(toggleModal(false))
  };

  const open = useSelector(state => state.tables.modalOpen);

  return (
    <div>
     <Button  
        variant="contained" color="primary" size="small" 
        onClick={handleOpen}
        >
        Create Project
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
      <div style={modalStyle} className={classes.paper}>
        {props.children}
      </div>
      </Modal>
    </div>
  );
}