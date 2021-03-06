import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { toggleCommentsModal } from '../redux/tableSlice'
import Typography from '@material-ui/core/Typography'
import { useFirestore } from 'react-redux-firebase'

import CircularProgress from '@material-ui/core/CircularProgress';

import { useParams } from 'react-router-dom';
import './CreateProjectForm.scss'

import { selectUsers } from '../redux/usersSlice'
import { useSelector, useDispatch } from 'react-redux'
import {  isLoaded } from 'react-redux-firebase'
import { toggleSnackbar } from '../redux/tableSlice';

const useStyles = makeStyles((theme) => ({

  formControl: {
    margin: theme.spacing(1),
    marginLeft:0,
    marginRight:0,
    minWidth: 250,
 
    width:"100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: 8,
    marginLeft:  theme.spacing(1),
    marginRight: 0,
    // width:'100%'
  },
  nativeSelects: {
    maxWidth: 500,
  }
}));


function CreateCommentForm({ ticket,}) {
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const { ticketId } = useParams();
  // const modalOpen = useSelector(state => state.tables.modalOpen);
  // const auth = useSelector(state => state.firestore.auth);
  // console.log('tick', ticket)
  
  const classes = useStyles();
  const [state, setState] = React.useState({
    body: '',
  });


  const projects = useSelector(
    ({ firestore: { ordered } }) => ordered.projects
  )
  const users = useSelector(selectUsers);
  const auth = useSelector(state => state.firebase.auth)

  // Show a spinner while loading
  if (!isLoaded(projects, users, auth) ) {
    return <CircularProgress/>
  }


  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };
  
  function handleClose(event) {
    dispatch(toggleCommentsModal(false))
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (state.body === '') {
      // alert('Cannot create ticket unless all form values are filled out');
      dispatch(toggleSnackbar([true, 'error', 'Cannot post an empty comment.']));
      return;
    }

    const newTicket = {
      body: state.body,
      ticketId: ticketId,
      submitter: auth.uid ? auth.uid : '',
      dateCreated: firestore.Timestamp.fromDate(new Date()),
    }

    try {
      await firestore.collection('comments_ticket').add(newTicket);
      dispatch(toggleSnackbar([true, 'success', 'Comment posted!']));
    } catch(error) {
      dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
    }
    dispatch(toggleCommentsModal(false))
  }

  return (
    <div className={classes.nativeSelects}>
         <Typography variant='h6'>Post Comment</Typography>
         <br/>
        {/* <h3>Select a Role</h3> */}
        <form onSubmit={handleSubmit}>
       
          <TextField 
            type="text" 
            className={`search ${classes.formControl}`}
            multiline
            placeholder="Comment" 
            label="Comment"
            value={state.body}
            onChange={handleChange}
            inputProps={{
              name: 'body',
              id: 'project-body-field',
              maxLength: 500
            }}
            variant="outlined"
            style = {{width: 500,}}
          />

        

            <br/>
            <div className="actionContainer">
              <Button 
              color="primary"
              className={classes.button}
              onClick={handleClose}
              autoFocus> 
              Cancel
            </Button>
            <Button 
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"> 
              Post Comment
            </Button>
          </div>
         
        </form>
    </div>
  );
}


export default (CreateCommentForm);
