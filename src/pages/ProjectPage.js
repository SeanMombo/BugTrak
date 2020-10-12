import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFirestoreConnect, isLoaded, isEmpty, populate } from 'react-redux-firebase'
import { useParams } from 'react-router-dom'
import { selectTableUsersProjects, selectTableTicketsProjects} from '../redux/tableSlice';
import { actionTypes } from 'redux-firestore'
import DataTable from '../components/DataTable'
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddUsersToProject from '../components/AddUsersToProject';

import './ProjectPage.css'


const usersProjectsPopulates = [
    { child: 'collaborators', root: 'users' }
];

const ticketPopulates = [
    { child: 'assignee', root: 'users' },
    { child: 'submitter', root: 'users' }
];

function ProjectPage() {

    const { projectId } = useParams() // matches todos/:todoId in route
    const dispatch = useDispatch();
    
    const projectsQuery = {
        collection: 'projects',     
    }
    
    const usersProjectsQuery = {
        collection: 'users_projects', 
        doc: projectId,
        populates: usersProjectsPopulates,
    }
    const ticketsQuery = {
        collection: 'tickets', 
        where: [['projectId', '==', projectId]],
        populates: ticketPopulates,
    }


    // Attach users listener
    useFirestoreConnect(() => [ticketsQuery, usersProjectsQuery, projectsQuery])

    useEffect(() => {
        return () => dispatch({ type: actionTypes.CLEAR_DATA }) // eslint-disable-next-line
    },[]) 
    
    const users_projects = useSelector(({ firestore }) => populate(firestore, 'users_projects', usersProjectsPopulates));

    const project = useSelector(
        ({ firestore: { data } }) => data.projects && data.projects[projectId]
    ) 
   

    let tickets = useSelector(({ firestore }) => populate(firestore, 'tickets', ticketPopulates));

    let tableUsersProjects = useSelector(selectTableUsersProjects);

    let tableTickets = useSelector(selectTableTicketsProjects);



    // Show a message while users are loading
    if (!isLoaded(project, users_projects, tickets)) {
        return <CircularProgress/>
    }
    
    let usersInProject = users_projects[projectId]['collaborators'];

    if (usersInProject)
        usersInProject = Object.values(usersInProject);
    else 
        usersInProject = [];
   

    //add an id field to tickets. This happens automatically for usersInProject, but not for tickets bc we do a where: [] in the query.
    let ticketsInProject = tickets;

    if (ticketsInProject)
        ticketsInProject = Object.keys(ticketsInProject).map(key => {
            const newObj = Object.assign({id: key}, ticketsInProject[key]);

            return newObj;
        });
    else 
        ticketsInProject = [];

    return (
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
                    <AddUsersToProject />
                {
                    !isEmpty(users_projects) ? 
                        <DataTable data={usersInProject}  tableProps={tableUsersProjects}/> 
                        : null
                }       
                </div>  
            </div>

            <div className='projectPageBottom'>
                <div className='ticketTable'>
                {
                    isLoaded(tickets) ? 
                        <DataTable data={ticketsInProject} tableProps={tableTickets}/> 
                        : null  
                }   
                </div>  

            </div>      
        </div>
    )
}

export default ProjectPage

