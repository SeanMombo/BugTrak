import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { toggleModal } from '../redux/tableSlice'
import Typography from '@material-ui/core/Typography'
import { useFirestore } from 'react-redux-firebase'
import Autocomplete from '@material-ui/lab/Autocomplete';
// import { useParams } from 'react-router-dom';
import './CreateProjectForm.scss'
import { priorities, statuses, types } from '../constants'

import { toggleSnackbar } from '../redux/tableSlice';
import { useDispatch } from 'react-redux'
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


function EditTicketForm({ projects, ticket, users }) {
  const firestore = useFirestore();
  const dispatch = useDispatch();
  // const { ticketId } = useParams();
  // const modalOpen = useSelector(state => state.tables.modalOpen);
  // const auth = useSelector(state => state.firestore.auth);
  
  const classes = useStyles();
  const [state, setState] = React.useState({
    title: ticket.title,
    body: ticket.body,
  });

  //project autocomplete
  const curProj = projects.find(obj => obj.id === ticket.projectId);
  const [projectValue, setProjectValue] = React.useState(curProj);
  const [projectInputValue, setProjectInputValue] = React.useState('');

  //assignee autocomplete
  const curAssignee = users[ticket.assignee];
  const [assigneeValue, setAssigneeValue] = React.useState(curAssignee);
  const [assigneeInputValue, setAssigneeInputValue] = React.useState('');

  //priority autocomplete
  const [priorityValue, setPriorityValue] = React.useState(priorities[ticket.priority]);
  const [priorityInputVale, setPriorityInputValue] = React.useState('');

  //status autocomplete
  const [statusValue, setStatusValue] = React.useState(statuses[ticket.status]);
  const [statusInputVale, setStatusInputValue] = React.useState('');

  //type autocomplete
  const [typeValue, setTypeValue] = React.useState(types[ticket.type]);
  const [typeInputValue, setTypeInputValue] = React.useState('');

  const prevValues = {
    title: ticket.title,
    body: ticket.body,
    projectId: ticket.projectId,
    assignee: ticket.assignee,
    priority: ticket.priority,
    status: ticket.status,
    type: ticket.type
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

    if (state.title === '' || state.body === '') {
      dispatch(toggleSnackbar([true, 'error', 'Please fill out all fields.']));
      return ;
    }

    function getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }

    const newValues = {
      title: state.title,
      body: state.body,
      projectId: projectValue.id,
      assignee: assigneeValue !== undefined ? assigneeValue.id : 'unassigned',
      priority: getKeyByValue(priorities, priorityValue),
      status: getKeyByValue(statuses, statusValue),
      type: getKeyByValue(types, typeValue),
    }

    console.log("ay", assigneeValue, prevValues, newValues)

    
    
    try {

      await firestore.update(`tickets/${ticket.id}`, newValues)
      dispatch(toggleSnackbar([true, 'success', 'Ticket successfully updated.']));

    } catch(error) {
      dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
    }

    try {
      Object.keys(prevValues).forEach(key => {
        // console.log('NEW VALS', prevValues[key], newValues[key])
        // debugger;

        //Format values to send to the history_ticket collection
        let prev = prevValues[key];
        let cur = newValues[key];
        if (key === 'assignee') {
          prev = prev === 'unassigned' ? 'unassigned' : users[prevValues[key]].displayName;
          cur = cur === 'unassigned' ? 'unassigned' : users[newValues[key]].displayName;
        }



        let historyDoc = {
          prevVal: key === 'assignee' ? prev : prevValues[key], 
          val: key === 'assignee' ? cur : newValues[key], //users[newValues[key]].displayName : newValues[key],
          property: key,
          ticketId: ticket.id,
          dateEdited: firestore.Timestamp.fromDate(new Date()),
        }
  
        if (prevValues[key] !== newValues[key]) {
          firestore.collection('history_ticket').add(historyDoc)
        }
      })
    } catch(error) {
      dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
    }

    dispatch(toggleModal(false))
  }

  return (
    <div className={classes.nativeSelects}>
         <Typography variant='h6'>Edit Ticket</Typography>
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
                      value={projectValue}
                      onChange={(event, newValue) => {
                          setProjectValue(newValue);
                      }}
                      inputValue={projectInputValue}
                      onInputChange={(event, newInputValue) => {
                          setProjectInputValue(newInputValue);
                      }}
                      disableClearable
                      autoComplete={true}
                      autoSelect={true}
                      autoHighlight={true}
                      openOnFocus={true}
                      id="projectAutoId"
                      options={projects}
                      getOptionLabel={(option) => option.title}
                      style={{ width: 300, marginTop: '8px' }}
                      renderInput={(params) => <TextField {...params} variant="outlined" label="Project"/>}
                      
                  />
                </div>
              
                <div>
                <Autocomplete
                    value={assigneeValue}
                    onChange={(event, newValue) => {
                        setAssigneeValue(newValue);
                    }}
                    inputValue={assigneeInputValue}
                    onInputChange={(event, newInputValue) => {
                        setAssigneeInputValue(newInputValue);
                    }}
                    disableClearable
                    autoComplete={true}
                    autoSelect={true}
                    autoHighlight={true}
                    openOnFocus={true}
                    id="assigneeAutoId"
                    options={Object.values(users)}
                    getOptionLabel={(option) => option.displayName}
                    style={{ width: 300, marginTop: '16px' }}
                    renderInput={(params) => <TextField {...params} variant="outlined" label="Assignee"/>}
                    
                />
              </div>
            
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
            
                <div>
                  <Autocomplete
                      value={statusValue}
                      onChange={(event, newValue) => {
                        setStatusValue(newValue);
                      }}
                      inputValue={statusInputVale}
                      onInputChange={(event, newInputValue) => {
                        setStatusInputValue(newInputValue);
                      }}
                      disableClearable
                      autoComplete={true}
                      openOnFocus={true}
                      id="StatusAutoId"
                      options={Object.values(statuses)}
                      // getOptionLabel={(option) => option.displayName}
                      style={{ width: 300, marginTop: '16px' }}
                      renderInput={(params) => <TextField {...params} variant="outlined" label="Status" disableAnimation/>}
                      
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
              Edit Ticket
            </Button>
          </div>
         
        </form>
    </div>
  );
}



export default (EditTicketForm);
