import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link,
    useHistory
} from "react-router-dom";

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
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
  },
  AppBar: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    
    boxShadow: 'none',

  }
}));

export default function SimpleTabs() {
    const history = useHistory();
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    console.log(event, newValue)
    if (newValue === 0) {
        history.push('/manageprojects/manage');
    } else {
        history.push('/manageprojects/myprojects')
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.AppBar} boxShadow={0}>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Manage Projects" {...a11yProps(0)} />
          <Tab label="My Projects" {...a11yProps(1)} />

        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>

    </div>
  );
}