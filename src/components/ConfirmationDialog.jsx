import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';

import { useFirestore } from 'react-redux-firebase'
import { Delete } from '@material-ui/icons'
import ArchiveIcon from '@material-ui/icons/Archive';
import { useParams, useLocation } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import './ConfirmationDialogue.scss'
import { tableTypes } from '../constants'

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

    console.log(id, urlId, params, location);

    const handleOpen = () => {
        setOpen(true);
    };  

    const handleDisagree = () => {
        setOpen(false);
    };  

    const firestore = useFirestore();

    const handleAgree = () => {
        if(open) {
            if(tableType === tableTypes.projects) {
                
                firestore.delete(`/projects/${id}`)    
                firestore.delete(`/users_projects/${id}`)   
                
            } 
            else if(tableType === tableTypes.users_projects) {
                firestore.update(`/users_projects/${urlId}`, {
                    collaborators: firestore.FieldValue.arrayRemove(`${id}`)
                })
            } 
            else if(tableType === tableTypes.tickets) {
                firestore.update(`/tickets/${id}`, {
                    status: 'resolved'
                })
            }
        }   
    };


  
    return (
        <div>
            {
                tableType === tableTypes.tickets ? <Button 
                className="closeButton" 
                onClick={handleOpen}  
                variant="contained" 
                color="secondary" 
                size="small" 
                startIcon={ <ArchiveIcon/> }
                >
                Archive
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