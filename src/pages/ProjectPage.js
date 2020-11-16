import React, { useEffect } from 'react'
// import { createSelector } from 'reselect'
import { useSelector, useDispatch } from 'react-redux'
import { useFirestoreConnect, isLoaded,} from 'react-redux-firebase'
import { useParams } from 'react-router-dom'
import { selectTableUsersProjects, selectTableTicketsProjects} from '../redux/tableSlice';
import { selectUsers } from '../redux/usersSlice';


import { actionTypes } from 'redux-firestore'
import DataTable from '../components/DataTable.jsx'
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider'
import BackButton from '../components/BackButton'


import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import CardHeader from '@material-ui/core/CardHeader';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import AddUsersToProject from '../components/AddUsersToProject';
import { tableTypes } from '../constants';

import './ProjectPage.css'


// const usersProjectsPopulates = [
//     { child: 'collaborators', root: 'users' }
// ];

// const ticketPopulates = [
//     { child: 'assignee', root: 'users', keyProp: 'id' },
//     { child: 'submitter', root: 'users', keyProp: 'id' }
// ];

function ProjectPage() {

    const { projectId } = useParams() 
    const dispatch = useDispatch();
    
    const projectsQuery = {
        collection: 'projects',     
    }
    // const usersQuery = {
    //     collection: 'users',     
    // }
    const usersProjectsQuery = {
        collection: 'users_projects', 
        doc: projectId,
        // populates: usersProjectsPopulates,

    }
    const ticketsQuery = {
        collection: 'tickets', 
        where: [['projectId', '==', projectId]],
        // populates: ticketPopulates,
    }

    useEffect(() => {
        return () => dispatch({ type: actionTypes.CLEAR_DATA })
    },[dispatch])

    // Attach users listener
    useFirestoreConnect(() => [ ticketsQuery, projectsQuery, usersProjectsQuery ])

    const users_projects = useSelector(
        ({ firestore: { data } }) => data.users_projects
    ) 
    const tickets = useSelector(
        ({ firestore: { data } }) => data.tickets
    ) 

    const users = useSelector(selectUsers) 

    const project = useSelector(
        ({ firestore: { data } }) => data.projects && data.projects[projectId]
    ) 


    let tableUsersProjects = useSelector(selectTableUsersProjects);
    let tableTickets = useSelector(selectTableTicketsProjects);

    // Show a message while users are loading
    if (!isLoaded(project, tickets, users_projects, users) ) {
        return <CircularProgress/>
    }
    
    let newArr = [];
    let usersInProject = users_projects[projectId]['collaborators'];
    if (usersInProject && Object.keys(usersInProject).length !== 0) {
        
        newArr = usersInProject.map(key => {
            return {...users[key]}
        });
    }
    else 
        usersInProject = [];
    usersInProject = newArr;

    const usersNotInProject = Object.values(users);



    //add an id field to tickets. This happens automatically for usersInProject, but not for tickets bc we do a where: [] in the query.
    let ticketsInProject = tickets;
    if (ticketsInProject) {

        ticketsInProject = Object.keys(ticketsInProject).map(key => {
            const newObj = {...tickets[key]};
            newObj['assignee'] = users[newObj['assignee']];
            newObj['submitter'] = users[newObj['submitter']];
            newObj['id'] = key;
            return newObj;
        }) 
    } else {
        ticketsInProject = []
    }
    
    console.log(users, ticketsInProject, usersInProject)
    return (
        <div>
            <Typography className='title' variant="h4" component="h1">Project Details</Typography>
            <br/><BackButton/>
            <Divider/>
            <div className='projectPage'>
                <div className='projectPageTop'>
                    <Card className='card' elevation={3}>
                        {/* <CardHeader className='cardHeader' title='Project Details' variant="dense">
                
                        </CardHeader> */}
                        <CardContent>
                                {/* <Typography className='greyText'variant='caption' component='p' gutterBottom>Title</Typography> */}
                                <Typography className='greyText2' variant='h4' component='h4' gutterBottom >{project.title}</Typography>
                            
                            <Divider/><br/>
                            {/* <Typography className='greyText' variant='caption' component='p' gutterBottom>Description</Typography> */}
                            <Typography  variant='p' component='p' gutterBottom >{project.body}</Typography>
                        </CardContent>

                    </Card>
                    
                    <div className='userTable'>
                        <div className='wrapTable'>
                        {
                            <DataTable key={usersInProject} data={usersInProject} tableProps={tableUsersProjects} tableType={tableTypes.users_projects} users={usersNotInProject}/>  
                        }       
                        </div>
                    </div>  
                </div>

                <div className='projectPageBottom'>
                    <div className='ticketTable'>
                    {
                        <DataTable key={ticketsInProject} data={ticketsInProject} tableProps={tableTickets} tableType={tableTypes.tickets}/> 
                    }   
                    </div>  

                </div>      
            </div>
        </div>
    )
}

export default ProjectPage

