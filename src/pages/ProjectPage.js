import React from 'react'
import { useSelector } from 'react-redux'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, useFirestoreConnect, isLoaded, isEmpty, populate } from 'react-redux-firebase'
import { useParams } from 'react-router-dom'
import { selectTableUsersProjects, selectTableTicketsProjects} from '../redux/tableSlice';

import DataTable from '../components/DataTable'
// import TransferList from '../components/transferlist.component';

// import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
// import { makeStyles } from '@material-ui/core/styles';


// import ContainerWrapper from '../components/ContainerWrapper'
import './ProjectPage.css'


// const useStyles = makeStyles({
//     root: {
//       minWidth: 275,
//     },

//     title: {
//       fontSize: 14,
//     },

//   });



const usersProjectsPopulates = [
    { child: 'collaborators', root: 'users' }
];

const ticketPopulates = [
    { child: 'assignee', root: 'users' },
    { child: 'submitter', root: 'users' },
];

function ProjectPage() {
    const { projectId } = useParams() // matches todos/:todoId in route
    
    const projectsQuery = {
        collection: 'projects',     
    }
    
    const usersProjectsQuery = {
        collection: 'users_projects', 
        doc: projectId,
        usersProjectsPopulates,
    }

    // const usersQuery = {
    //     collection: 'users', 
    // }

    const ticketsQuery = {
        collection: 'tickets', 
        where: [['projectId', '==', projectId]],
        storeAs:`tickets_${projectId}`,
        ticketPopulates,
    }
    console.log(projectId)
    // Attach users listener
    useFirestoreConnect(() => [projectsQuery, usersProjectsQuery, ticketsQuery])

    const users_projects = useSelector(({ firestore }) => populate(firestore, "users_projects", usersProjectsPopulates));

    const project = useSelector(
        ({ firestore: { data } }) => data.projects && data.projects[projectId]
    )

    // const tickets = useSelector(
    //     ({ firestore: { ordered } }) => ordered[`tickets_${projectId}`]
    // )

    const users_projects = useSelector(({ firestore }) => populate(firestore, "users_projects", usersProjectsPopulates));

    let tableUsersProjects = useSelector(selectTableUsersProjects);

    let tableTickets = useSelector(selectTableTicketsProjects);


    // Show a message while users are loading
    if (!isLoaded(project) || !isLoaded(users_projects) || !isLoaded(tickets)) {
        return 'Loading'
    }


    let usersInProject = users_projects[projectId]['collaborators'];

    usersInProject = Object.values(usersInProject);
    console.log(usersInProject)
    
    return (
        <div className='projectPage'>


            <div className='projectPageTop'>
                <Card className='card'>
                    <CardHeader className='cardHeader' title='Project Details'>
                        {/* <Typography  variant="h6" id="tableTitle" component="div">
                            Project Details
                        </Typography> */}
                    </CardHeader>
                    <CardContent>
                        <div className='detail'>
                            <h5>Project Title:</h5>
                            <h2>{project.title}</h2>
                        </div>
                        <div className='detail'>
                            <h5>Project Description:</h5>
                            <h2>{project.body}</h2>
                        </div>
                    </CardContent>

                </Card>

                <div className='userTable'>
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
                        <DataTable data={tickets} tableProps={tableTickets}/> 
                        : null  
                }   
                </div>  

                {/* <div className='ticketTable'>
                {
                    isLoaded(tickets) ? 
                       tickets.map(ticket => {
                        return (
                            <Card>
                                <CardContent>
                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        Title
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        {ticket.title}
                                    </Typography>

                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        {ticket.body}
                                    </Typography>
                                </CardContent>
                            </Card>
                       )}) : null
                }   
                </div>   */}

            </div>
           

            
           
           
        </div>
    )
    

    // const firestore = useFirestore()
    
    // function toggleDone() {
    //     firestore.update(`projects/${projectId}`, { title: 'Hi :]' })
    // }
    
    // function deleteTodo() {
    //     return firestore.delete(`projects/${projectId}`)
    // }

}



export default ProjectPage

