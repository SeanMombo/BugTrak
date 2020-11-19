import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { toggleSnackbar, selectSnackbar } from '../redux/tableSlice';
import { useSelector, useDispatch } from 'react-redux'
import { isLoaded } from 'react-redux-firebase'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars() {
    const classes = useStyles();
    const open = useSelector(selectSnackbar);
    const message = useSelector(state => state.tables.snackbarMessage);
    const type = useSelector(state => state.tables.snackbarType);

    const dispatch = useDispatch();

    if (!isLoaded(open)) return <div></div>

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(toggleSnackbar([false, type, '']));
    };

  return (
    <div className={classes.root}>

      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
     
    </div>
  );
}