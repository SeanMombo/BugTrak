import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actionTypes } from 'redux-firestore'
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import DataTable from '../components/DataTable.jsx'
import { tableTypes } from '../constants';
import { selectTableUsersTable } from '../redux/tableSlice';
import { userConversion, userTypes } from '../constants'
import './ManageUsersPage.scss'
import { makeStyles } from '@material-ui/core/styles';

import { useFirestore } from 'react-redux-firebase'
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

    // width:'100%'
  },
  nativeSelects: {
    maxWidth: 500,
  }
}));

const usersQuery = {
    collection: 'users', 
}

function ManageUsers() {
  const [userValue, setUserValue] = React.useState('');
  const [inputUserValue, setInputUserValue] = React.useState('');

  const [roleValue, setRoleValue] = React.useState('');
  const [inputRoleValue, setInputRoleValue] = React.useState('');

  const firestore = useFirestore();
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
      return () => dispatch({ type: actionTypes.CLEAR_DATA })
  },[dispatch])
  
  // Attach users listener
  useFirestoreConnect(() => [usersQuery])

  // Get users from redux state
  const users = useSelector(
    ({ firestore: { ordered } }) => ordered.users
  )

  // const users = useSelector(state => state.users.users)
  let tableUsersTable = useSelector(selectTableUsersTable);


  // Show a message while users are loading
  if (!isLoaded(users)) {
    return <CircularProgress/>
  }

  // const usersArray = Object.values(users);

  // Show a message if there are no users
  if (isEmpty(users)) {
    return 'No Data'
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(userValue, roleValue)
    if (userValue === '' || roleValue === '') {  
      dispatch(toggleSnackbar([true, 'error', 'Please fill out all fields.']));
      return;
    }

    // debugger; 
    try {
      firestore.update(`users/${userValue.id}`, {
        userType: userTypes[roleValue]
      })
      dispatch(toggleSnackbar([true, 'success', 'User role succesfully updated!']));
      clearAll();
    } catch(error) {
      dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
    }
    
  }

  function clearAll() {
    setUserValue('');
    setInputUserValue('');
    setRoleValue('');
    setInputRoleValue('');
  }

  function handleClear(event) {
    event.preventDefault();
    clearAll();
  }


  return (
    <div className='manageUsersPage'>
      {/* left side */} 
      <Card className='leftSide' elevation={3}>
        <Paper square elevation={1} className='cardHeader'>
            <Typography className='greyText2' variant='h6' component='h6'>Assign User Roles</Typography>
            
        </Paper>
        <div className='cardContent'>
          <div>
            <form onSubmit={handleSubmit}>

              <Autocomplete
                  value={userValue}
                  onChange={(event, newValue) => {
                    setUserValue(newValue === null ? '' : newValue);
                  }}
                  inputValue={inputUserValue}
                  onInputChange={(event, newInputValue) => {
                    setInputUserValue(newInputValue === null ? '' : newInputValue);
                  }}
                  variant="outlined"
                  autoComplete={true}
                  autoSelect={true}
                  autoHighlight={true}
                  id="controllable-states-demo"
                  options={users}
                  getOptionLabel={(option) => option.displayName}

                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Users" variant="outlined"/>}
              />

              <br/>

              <Autocomplete
                  value={roleValue}
                  onChange={(event, newValue) => {
                    setRoleValue(newValue === null ? '' : newValue);
                  }}
                  inputValue={inputRoleValue}
                  onInputChange={(event, newInputValue) => {
                    setInputRoleValue(newInputValue === null ? '' : newInputValue); 
                  }}
                  autoComplete={true}
                  autoSelect={true}
                  autoHighlight={true}
                  id="role-states-demo"
                  options={Object.values(userConversion)}
                  
                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Roles" variant="outlined" />}
              />

              <br/>
              <br/>

              <div className='buttonContainer'>
                
              <Button 
                  // fullWidth="true"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  style={{ width: '50%', float:'right'}}
                  type="submit"> 
                  Update Roles
                </Button>
                
                <Button 
                  // fullWidth="true"
                  variant="outlined"
                 
                  color="secondary"
                  className={classes.button}
                  onClick={handleClear}
                  style={{ marginRight: 8, width: '45%', float:'left'}}
                  > 
                  Clear
                </Button>

              </div>
               
            
            </form>
          </div>
          
        </div> {/* end cardContent */}
      </Card>

      {/* right side */}
      <div className='rightSide'>
      {
          <DataTable key={users} data={users} tableProps={tableUsersTable} tableType={tableTypes.users_table} users={users}/>  
      }    
      </div> 

    </div>
    
  )

}

export default ManageUsers