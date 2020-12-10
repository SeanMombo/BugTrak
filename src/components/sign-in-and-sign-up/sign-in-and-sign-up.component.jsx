import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Button from '@material-ui/core/Button'
import { toggleSnackbar } from '../../redux/tableSlice';
import { useFirebase } from 'react-redux-firebase'
import { useDispatch } from 'react-redux'
import SignIn from '../../components/sign-in/sign-in.component';
import SignUp from '../../components/sign-up/sign-up.component';

import './sign-in-and-sign-up.styles.scss';



function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      // flexGrow: 1,
      minWidth:1000,
      backgroundColor: theme.palette.background.paper,
    },
    appbar: {
        backgroundColor: 'black',
    }
  }));
  


  function SimpleTabs() {

    
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const dispatch = useDispatch();
    const firebase = useFirebase();
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    async function handleGuestLogin1(event) {
        event.preventDefault();
        const email = 'admin@guest.com'

        firebase.login({ email: email, password: 'test123'}).catch((error) => {
            dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
        })
    };

    async function handleGuestLogin2(event) {
        event.preventDefault();
        const email = 'dev@guest.com'

        firebase.login({ email: email, password: 'test123'}).catch((error) => {
            dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
        })
    };
    async function handleGuestLogin3(event) {
        event.preventDefault();
        const email = 'submitter@guest.com'

        firebase.login({ email: email, password: 'test123'}).catch((error) => {
            dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
        })
    };
    async function handleGuestLogin4(event) {
        event.preventDefault();
        const email = 'pm@guest.com'

        firebase.login({ email: email, password: 'test123'}).catch((error) => {
            dispatch(toggleSnackbar([true, 'error', error.code + ' - ' + error.message]));
        })
    };
    
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appbar}>
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered>
            <Tab label="SignIn/SignUp" {...a11yProps(0)} />
            {/* <Tab label="Guest Account" {...a11yProps(1)} /> */}
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
           <SignInAndSignUp/>
        </TabPanel>
        <TabPanel value={value} index={1}>
        <div className='demo-accounts'>
            <div className='demo-box'>
                <Button  
                onClick={handleGuestLogin1}
                variant="contained"
                color="primary"
                style={{width:220, height:50, borderRadius:0, backgroundColor:'black', marginBottom:50}}
                > 
                    Guest Admin
                </Button>
            </div>
            {/* <div className='demo-box'>
                <Button 
                onClick={handleGuestLogin4}
                variant="contained"
                color="primary"
                style={{width:220, height:50, borderRadius:0, backgroundColor:'black', marginBottom:50}}
                > 
                    PROJECT MANAGER
                </Button>
            </div>
            <div className='demo-box'>
                <Button 
                onClick={handleGuestLogin2}
                variant="contained"
                color="primary"
                style={{width:220, height:50, borderRadius:0, backgroundColor:'black', marginBottom:50}}
                > 
                    DEVELOPER
                </Button>
            </div>
            <div className='demo-box'>
                <Button 
                onClick={handleGuestLogin3}
                variant="contained"
                color="primary"
                style={{width:220, height:50, borderRadius:0, backgroundColor:'black', marginBottom:50}}
                > 
                    SUBMITTER
                </Button>
            </div> */}
        </div>
        </TabPanel>

      </div>
    );
  }
  

    const SignInAndSignUp = () => (
        <div className='sign-in-and-sign-up'>
            <SignIn/>
            <SignUp/>
        </div>
    )

   



export default SimpleTabs;