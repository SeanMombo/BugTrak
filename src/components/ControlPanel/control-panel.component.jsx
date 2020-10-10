import React from 'react';



import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

import { Switch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom'; 

function ListItemLink(props) {
  const { icon, primary, to, id, selectedIndex, handleListItemClick} = props;
  

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <li>
      <ListItem 
        button 
        component={renderLink} 
        selected={selectedIndex === id}
        onClick={(event) => handleListItemClick(event, id)}
      >

        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    height:'100%',
    width: 230,

    // paddingRight:16,
 
    position:'fixed',
    
  },
  paper: {
    paddingTop:32,
     marginTop:1,
    height:'100%',
  },

  noPadding: {

    paddingTop:0,

  },
});

function ControlPanel() {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  
  return (
    // <Switch initialEntries={['/users']} initialIndex={0}
    <Switch > 
      <div className={classes.root}>
        {/* <Route>
          {({ location }) => (
            <Typography gutterBottom>Current route: {location.pathname}</Typography>
          )}
        </Route> */}
        <Paper elevation={2} className={classes.paper} square >
          <List aria-label="main mailbox folders">
            <ListItemLink to="/manageusers" primary="Manage Users" icon={<InboxIcon />} id={0} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>
            <ListItemLink to="/manageprojects" primary="Manage Projects" icon={<DraftsIcon />} id={1} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>
            <ListItemLink to="/myprojects" primary="My Projects" icon={<InboxIcon />} id={2} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>
            <ListItemLink to="/mytickets" primary="My Tickets" icon={<DraftsIcon />} id={3} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>
          </List>
         
        </Paper>
      </div>
    </Switch>
  );
}




export default (ControlPanel);