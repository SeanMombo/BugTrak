import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';

import { useFirestore } from 'react-redux-firebase'
import { Delete } from '@material-ui/icons'
import ArchiveIcon from '@material-ui/icons/Archive';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import { useDispatch } from 'react-redux'

import { useParams, useLocation } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import { tableTypes } from '../constants'
import { toggleSnackbar } from '../redux/tableSlice';

import './ConfirmationDialogue.scss'


export default function ConfirmationDialogue({id, route, visible, tableType}) {
    
    // switch(tableType) {
    //     case tableTypes.projects: {
    //         break;
    //     }
    // }

    const [open, setOpen] = React.useState(visible);
    const params = useParams();
    const location = useLocation();
    const urlId = Object.values(params)[0];
    const dispatch = useDispatch();

    console.log(id, urlId, params, location);

    const handleOpen = () => {
        setOpen(true);
    };  

    const handleDisagree = () => {
        setOpen(false);
    };  

    const firestore = useFirestore();

    const handleAgree = async () => {
        if(open) {
            if(tableType === tableTypes.projects) {
                
                try {
                    await firestore.delete(`/projects/${id}`)    
                    await firestore.delete(`/users_projects/${id}`)   
                    dispatch(toggleSnackbar([true, 'success', 'Project succesfully deleted']));
                } catch (error) {
                    dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
                }
                

                
                
            } 
            else if(tableType === tableTypes.users_projects) {
                try {
                    await firestore.update(`/users_projects/${urlId}`, {
                        collaborators: firestore.FieldValue.arrayRemove(`${id}`)
                    })
                    dispatch(toggleSnackbar([true, 'success', 'User removed from project team.']));
                } catch (error) {
                    dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
                }

            } 
            else if(tableType === tableTypes.tickets) {
                try {
                    await firestore.update(`/tickets/${id}`, {
                        status: 'resolved'
                    })
                    dispatch(toggleSnackbar([true, 'success', 'Ticket has been archived.']));
                } catch (error) {
                    dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
                }

            }
        }   
    };


    return (
        <div>
            {
                tableType === tableTypes.tickets ? 
                <Button     
                    className="closeButton" 
                    onClick={handleOpen}  
                    variant="contained" 
                    color="secondary" 
                    size="small" 
                    startIcon={ <ArchiveIcon/> }
                    >
                    Archive
                </Button> 
                : tableType === tableTypes.users_projects ? 
                <Button     
                    className="closeButton" 
                    onClick={handleOpen}  
                    variant="contained" 
                    color="secondary" 
                    size="small" 
                    startIcon={ <RemoveCircleIcon/> }
                    >
                    Remove
                </Button> 
                : 
                <Button 
                    className="closeButton" 
                    onClick={handleOpen}  
                    variant="contained" 
                    color="secondary" 
                    size="small" 
                    startIcon={ <Delete/> }
                    >

                    Delete
                </Button>
            }
            
            

        <Dialog
            
            open={open}
            onClose={handleDisagree}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className="dialogueBox">
                <div className="marginBottom">
                    <Typography variant='h6'>Delete Data</Typography>
                </div>
                
                {/* <DialogTitle id="alert-dialog-title">{"Delete Data"}</DialogTitle> */}

                <div className="marginBottom">
                    {/* <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete data?
                    </DialogContentText> */}
                    <Alert variant="filled" color="error" severity="warning">
                        You are about to permanently delete data 
                    </Alert>
                </div>

                {/* <div className="marginBottom">
                    <Typography variant='subtitle1'>Path</Typography>
                    <Typography variant='h5'>{id}</Typography>
                    
                </div> */}

                <DialogActions className='dialogueActions'>
                    <Button onClick={handleDisagree}  color="primary" autoFocus>
                        Cancel 
                    </Button>
                    <Button onClick={handleAgree} variant="contained" color="secondary">
                        Start Delete
                    </Button>
                </DialogActions>
            </div>
           
        </Dialog>
        </div>
    );
}