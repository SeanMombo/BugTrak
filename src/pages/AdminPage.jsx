import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {

  Switch,
  Route,

  useRouteMatch
} from "react-router-dom";
import { useDispatch } from 'react-redux'
import ManageProjectsPage from './ManageProjectsPage';
import ManageUsersPage from './ManageUsersPage';


import './AdminPage.scss'
function AdminPage() {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    let { path } = useRouteMatch();
  
    return (
      <div>
          <Typography variant="h4" component="h1">Administrator Panel</Typography>

        <SimpleTabs/> 
        {/* <div className='tabs'>
          <li>
            <Link to={`${url}/projects`}>Projects</Link>
          </li>
          <li>
            <Link to={`${url}/users`}>Users</Link>
          </li>

        </div> */}
  
        <Switch>

          <Route path={`${path}/projects`}>
            <ManageProjectsPage/>
          </Route>
          <Route path={`${path}/users`}>
            <ManageUsersPage/>
          </Route>
        </Switch>
      </div>
    );
  }

export default AdminPage
  


const AntTabs = withStyles({
    root: {
        backgroundColor:'transparent',
         borderBottom: '1px solid #e8e8e8',
         padding:0,
    },
    indicator: {
      backgroundColor: '#1890ff',
    },
  })(Tabs);
  
  const AntTab = withStyles((theme) => ({
    root: {
        paddingLeft:0,
        textTransform: 'none',
        minWidth: 50,
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.text.primary,
        marginRight: theme.spacing(4),
        fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: theme.palette.text.primary,
            // opacity: 1,
        },
        '&$selected': {
            color: theme.palette.info.dark,
            fontWeight: theme.typography.fontWeightBold,
        },
        '&:focus': {
            color: theme.palette.info.dark,
        },
    },
    selected: {},
  }))((props) => <Tab disableRipple {...props} />);


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
        <Box p={3} style={{padding:0}}>
          {children}
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
    paddingLeft:0,
    // backgroundColor: theme.palette.background.paper,
  },
  tab: {
    paddingLeft:0,
  },
  tabRoot: {
    paddingLeft:0,
  },
  tabPanel: {
    padding:0,
    '.MuiBox-root-16': {
        padding: '0',
      },
  },
}));

function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div className={classes.root}>
      
        <AntTabs className={classes.tabRoot} value={value} onChange={handleChange} aria-label="simple tabs example">
          <AntTab label="Projects" {...a11yProps(0)} />
          <AntTab label="Users" {...a11yProps(1)} />
        </AntTabs>
      
      <TabPanel className={classes.tabPanel} value={value} index={0}>
        <ManageProjectsPage/>
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={1}>
        <ManageUsersPage/>
      </TabPanel>

    </div>
  );
}