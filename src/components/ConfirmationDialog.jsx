import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';

import { useFirestore } from 'react-redux-firebase'
import { Delete } from '@material-ui/icons'
import { useParams } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import './ConfirmationDialogue.scss'


export default function ConfirmationDialogue({id, route, visible}) {
    const [open, setOpen] = React.useState(visible);
    const { projectId } = useParams();
    console.log(projectId, id)
    const handleOpen = () => {
        setOpen(true);
    };  

    const handleDisagree = () => {
        setOpen(false);
    };  

    const firestore = useFirestore();

    const handleAgree = () => {
        if(open) {
            if(route === '/project/') {
                firestore.delete(`/projects/${id}`)    
            } else if(route === '/users_projects/') {
                firestore.update(`users_projects/${projectId}`, {
                    collaborators: firestore.FieldValue.arrayRemove(`${id}`)
                })
            }
        }   
    };


  


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