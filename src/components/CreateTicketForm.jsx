import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { toggleModal } from '../redux/tableSlice'
import Typography from '@material-ui/core/Typography'
import { useFirestore } from 'react-redux-firebase'
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useParams } from 'react-router-dom';
import './CreateProjectForm.scss'
import { priorities, statuses, types } from '../constants'
import { selectUsers } from '../redux/usersSlice'
import { useSelector, useDispatch } from 'react-redux'
import { isLoaded } from 'react-redux-firebase'
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


function CreateTicketForm() {
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const { projectId } = useParams();
  // const modalOpen = useSelector(state => state.tables.modalOpen);
  // const auth = useSelector(state => state.firestore.auth);
  // console.log('tick', ticket)
  
  const classes = useStyles();
  const [state, setState] = React.useState({
    title: '',
    body: '',
  });



  //priority autocomplete
  const [priorityValue, setPriorityValue] = React.useState('');
  const [priorityInputVale, setPriorityInputValue] = React.useState('');

  //type autocomplete
  const [typeValue, setTypeValue] = React.useState('');
  const [typeInputValue, setTypeInputValue] = React.useState('');

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
    dispatch(toggleModal(false))
  }

  async function handleSubmit(event) {
    event.preventDefault();


    if (priorityValue === '' || typeValue === '' || state.title === '' || state.body === '') {  
      dispatch(toggleSnackbar([true, 'error', 'Please fill out all fields.']));

      return;
    }

    function getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }

    const newTicket = {
      title: state.title,
      body: state.body,
      projectId: projectId,
      assignee: 'unassigned',
      submitter: auth.uid ? auth.uid : 'unassigned',
      priority: getKeyByValue(priorities, priorityValue),
      status: getKeyByValue(statuses, 'New'),
      type: getKeyByValue(types, typeValue),
      dateCreated: firestore.Timestamp.fromDate(new Date()),
    }

 
    try {
      await firestore.collection('tickets').add(newTicket);
      dispatch(toggleSnackbar([true, 'success', 'Ticket successfully created!']));

    } catch(error) {
      dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
    }
    dispatch(toggleModal(false))
  }



  return (
    <div className={classes.nativeSelects}>
         <Typography variant='h6'>Create Ticket</Typography>
         <br/>
        {/* <h3>Select a Role</h3> */}
        <form onSubmit={handleSubmit}>
          <TextField 
            type="text" 
            className={`search ${classes.formControl}`}
            placeholder="Ticket Title" 
            label="Title"
            value={state.title}
            onChange={handleChange}
            inputProps={{
              name: 'title',
              id: 'project-title-field',
            }}
            variant="outlined"
          />
          <TextField 
            type="text" 
            className={`search ${classes.formControl}`}
            multiline
            placeholder="Ticket Description" 
            label="Description"
            value={state.body}
            onChange={handleChange}
            inputProps={{
              name: 'body',
              id: 'project-body-field',
            }}
            variant="outlined"
          />

          {/* autocompletes */}
          <div>

                <div>
                  <Autocomplete
                      value={priorityValue}
                      onChange={(event, newValue) => {
                        setPriorityValue(newValue);
                      }}
                      inputValue={priorityInputVale}
                      onInputChange={(event, newInputValue) => {
                        setPriorityInputValue(newInputValue);
                      }}
                      disableClearable
                      autoComplete={true}
                      openOnFocus={true}
                      id="PriorityAutoId"
                      options={Object.values(priorities)}
                      // getOptionLabel={(option) => option.displayName}
                      style={{ width: 300, marginTop: '16px' }}
                      renderInput={(params) => <TextField {...params} variant="outlined" label="Priority"/>}
                      
                  />
                </div>
            
                <div>
                  <Autocomplete
                      value={typeValue}
                      onChange={(event, newValue) => {
                        setTypeValue(newValue);
                      }}
                      inputValue={typeInputValue}
                      onInputChange={(event, newInputValue) => {
                        setTypeInputValue(newInputValue);
                      }}
                      disableClearable
                      autoComplete={true}
                      openOnFocus={true}
                      id="TypeAutoId"
                      options={Object.values(types)}
                      // getOptionLabel={(option) => option.displayName}
                      style={{ width: 300, marginTop: '16px' }}
                      renderInput={(params) => <TextField {...params} variant="outlined" label="Type" />}
                      
                  />
                </div>


            </div>

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
              Create Ticket
            </Button>
          </div>
         
        </form>
    </div>
  );
}


export default (CreateTicketForm);

