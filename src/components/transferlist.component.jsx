import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


import { connect } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  root: {
    // margin:'-16px',
    justifyContent:'center',
    minWidth:630
  },
  root2: {
    height:'100%',
    padding:16,
    paddingTop:0,
    // display:'flex',
    minWidth:630,
    flex:1,
    // backgroundColor: theme.palette.text.primary
    
  },
  root3: {

    padding:32,
    // backgroundColor: theme.palette.text.primary
    
  },
  cardTitle: {
    textAlign:'center',
    margin:8,
    
  },
  sectionTitle: {
    textAlign:'center',
    padding:16,
    
   
    // backgroundColor: 'black',
    // color: 'white',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 240,
    height: 330,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  buttonUpdate: {

    width:'575px',
    margin: theme.spacing(0.5, 0),
    marginTop: '16px'
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

function TransferList({users, users_projects, selectedProject, updateUsersProjects}) {
    console.log('Transferlist start')
    
    let projId = selectedProject.id;
    let usersAssignedToProject = users_projects.find(p => p.id === projId).users; //array of users who are assigned to project

    let l = [], r = [];

    r = usersAssignedToProject;
    l = Object.keys(users).map(key => users[key].id)

    l = l.filter(key => {
        return r.includes(key) ? false : true
        }
    )

    l = l.map(k => users.find(u => u.id === k).displayName);
    r = r.map(k => users.find(u => u.id === k).displayName);


    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(l);
    const [right, setRight] = React.useState(r);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
        newChecked.push(value);
    } else {
        newChecked.splice(currentIndex, 1);
    }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

  const handleUpdateTeam = () => {
    let l2, r2;

    l2 = left.map(k => users.find(u => u.displayName === k).id);
    r2 = right.map(k => users.find(u => u.displayName === k).id);

    updateUsersProjects(projId, r2);
  };

  const customList = (title, items, text) => (
      <div>
          
        <Card elevation={2}>
        <h2 className={classes.cardTitle}>{text}</h2>
        <Divider />
        <CardHeader
            className={classes.cardHeader}
            avatar={
            <Checkbox
                onClick={handleToggleAll(items)}
                checked={numberOfChecked(items) === items.length && items.length !== 0}
                indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                disabled={items.length === 0}
                inputProps={{ 'aria-label': 'all items selected' }}
            />
            }
            title={title}
            subheader={`${numberOfChecked(items)}/${items.length} selected`}
        />
        <Divider />
        <List className={classes.list} dense component="div" role="list">
            {items.map((value) => {
            const labelId = `transfer-list-all-item-${value}-label`;

            return (
                <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                <ListItemIcon>
                    <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                    />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${value}`} />
                </ListItem>
            );
            })}
            <ListItem />
        </List>
        </Card>
      </div>
  );

  return (
    // <div className={classes.root2} alignItems="center" >
       
      <Paper elevation={0} className={classes.root2} alignItems="center" >
        <Typography className={classes.sectionTitle} variant="h4" >Manage Project Team</Typography>
        <Divider/>
        <br/>
        {/* <Card className={classes.sectionTitle}>
        
        </Card> */}
        
        <Grid container spacing={2}  alignItems="center"  className={classes.root}>
          
          <Grid item >{customList('Choices', left, 'Unassigned Users')}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          
          <Grid item >{customList('Chosen', right, 'Current Team')}</Grid>
          <Button 
            className={classes.buttonUpdate}
            variant="contained" 
            color="primary"
            onClick={handleUpdateTeam}
            >
            Update Team
          </Button>
        </Grid>
        
      </Paper>

  );
}


export default TransferList