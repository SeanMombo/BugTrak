import React from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import PieChartIcon from '@material-ui/icons/PieChart';
import { Switch } from 'react-router';
import { Link as RouterLink, useParams } from 'react-router-dom'; 
import './control-panel.styles.scss'

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

const useStyles = makeStyles((theme) => ({
  root: {
    height:'100%',
    width: 230,

    // paddingRight:16,

    position:'fixed',
    
  },
  paper: {
    // paddingTop:32,
    //  marginTop:1,
    height:'100%',
    // color:'white',
    // backgroundColor: theme.palette.primary.dark,
  },

  noPadding: {
    paddingTop:0,
  },
}));


function ControlPanel() {
  const classes = useStyles();

  // const params = useParams();
  // let t = 0;
  // console.log(params)
  // if (params === 'manageprojects') t = 2;
  // else if (params === 'project') t = 2
  // else if (params === 'tickets') t = 4


  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };


  return (
    // <Switch initialEntries={['/users']} initialIndex={0}
    <Switch > 
      <div className={classes.root}>
      
        <Paper className={`${classes.paper} controlPanel`} square elevation={3}>
        <Typography className="bugTrackText" variant="h5" component="p">BugTrak</Typography>
        <Divider/>
          <List aria-label="main mailbox folders">
            <ListItemLink className="bold" to="/" primary="Dashboard" icon={<InboxIcon className="bold"/>} id={0} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>
            <ListItemLink className="bold" to="/admin" primary="Admin Panel" icon={<DraftsIcon className="bold"/>} id={2} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>
            <ListItemLink className="bold" to="/myprojects" primary="My Projects" icon={<InboxIcon className="bold"/>} id={3} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>
            <ListItemLink className="bold" to="/mytickets" primary="My Tickets" icon={<DraftsIcon className="bold"/>} id={4} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>
          </List>
         
        </Paper>
      </div>
    </Switch>
  );
}




export default (ControlPanel);