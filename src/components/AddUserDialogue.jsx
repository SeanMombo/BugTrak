import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFirestore } from 'react-redux-firebase'
import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';

import { useParams } from 'react-router-dom';

import './ConfirmationDialogue.scss'
export default function AddUserDialogue({ users, visible}) {
    const [open, setOpen] = React.useState(visible);
    const [value, setValue] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');

    const { projectId } = useParams();
 
    const firestore = useFirestore();

    const handleOpen = () => {
        setOpen(true);
    };  

    const handleDisagree = () => {
        setOpen(false);
    };  
    const handleAgree = () => {
        firestore.update(`users_projects/${projectId}`, {
            collaborators: firestore.FieldValue.arrayUnion(`${value.id}`)
        })
        setOpen(false);
    }; 

  
    
        

    // let options = (users).map(user => {
    //     return user['displayName']
    // })

    

    // const handleAgree = () => {
    //     if(open) {
    //         if(route === '/project/') {
    //             firestore.delete(`/projects/${id}`)    
    //         } else if(route === '/users_projects/') {
    //             firestore.update(`users_projects/${projectId}`, {
    //                 collaborators: firestore.FieldValue.arrayRemove(`${id}`)
    //             })
    //         }
    //     }   
    // };
    function UserAutocomplete() {

        return (
        <div>
           
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                autoComplete={true}
                autoSelect={true}
                autoHighlight={true}
                id="controllable-states-demo"
                options={users}
                getOptionLabel={(option) => option.displayName}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Users"  />}
            />
        </div>
        );
    }


    return (
        <div>
            <Button 
                className='addUserButton'
                onClick={handleOpen}  
                variant="contained" 
                color="primary" 
                size="small"  
                >
                Add User
            </Button>
            

        <Dialog
            open={open}
            onClose={handleDisagree}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Add User"}</DialogTitle>
            <DialogContent>
                <UserAutocomplete/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDisagree} color="secondary" autoFocus>
                    Cancel
                </Button>
                <Button onClick={handleAgree} variant="contained" color="primary" >
                    Add User 
                </Button>
            
            </DialogActions>
        </Dialog>
        </div>
    );
}

