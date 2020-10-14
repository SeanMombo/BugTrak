import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useSelector, useDispatch } from 'react-redux'
import { toggleModal } from '../redux/tableSlice'
import Typography from '@material-ui/core/Typography'
import { useFirestore } from 'react-redux-firebase'
import './CreateProjectForm.scss'


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


function CreateProjectForm() {

  

  const classes = useStyles();
  const [state, setState] = React.useState({
    title: '',
    body: '',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };
  
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const modalOpen = useSelector(state => state.tables.modalOpen);

  function handleClose(event) {
    dispatch(toggleModal(false))
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (state.title === '' || state.body === '') {
      alert('Cannot create a project with empty title or description');
      return ;
    }
    const newProj = { 
      title: state.title,
      body: state.body,
      dateCreated: firestore.Timestamp.fromDate(new Date()),
    };

    try {
      await firestore.collection('projects').add(newProj)
      
      alert('Project successfully created!')
      dispatch(toggleModal(false))

    } catch(error) {
      alert(error.code, error.message)
      dispatch(toggleModal(false))
    }

  }

  

  return (
    <div className={classes.nativeSelects}>
         <Typography variant='h6'>Create Project</Typography>
        {/* <h3>Select a Role</h3> */}
        <form onSubmit={handleSubmit}>
          <TextField 
            type="text" 
            className={`search ${classes.formControl}`}
            placeholder="Project Title" 
            value={state.title}
            onChange={handleChange}
            inputProps={{
              name: 'title',
              id: 'project-title-field',
            }}
          />
          <TextField 
            type="text" 
            className={`search ${classes.formControl}`}
            multiline
            placeholder="Project Description" 
            value={state.body}
            onChange={handleChange}
            inputProps={{
              name: 'body',
              id: 'project-body-field',
            }}
          />
            <br/>
            <div className="actionContainer">
              <Button 
              
              color="primary"
              className={classes.button}
              onClick="handleClose"
              autoFocus> 
              Cancel
            </Button>
            <Button 
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"> 

              Create Project
            </Button>
          </div>
         
        </form>
    </div>
  );
}



export default (CreateProjectForm);
