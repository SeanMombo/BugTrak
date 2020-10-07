import React from 'react'
import { useSelector } from 'react-redux'
import { useFirestoreConnect, useFirestore, isLoaded, isEmpty } from 'react-redux-firebase'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable'
import { selectTableUsersProjects, selectTableTickets } from '../redux/tableSlice';

import './ProjectPage.css'

function ProjectPage() {
    const { projectId } = useParams() // matches todos/:todoId in route

    const projectsQuery = {
        collection: 'projects',     
    }
    
    const usersProjectsQuery = {
        collection: 'users_projects', 
        doc: projectId
    }

    const usersQuery = {
        collection: 'users', 
    }

    const ticketsQuery = {
        collection: 'tickets', 
        where: [['projectId', '==', projectId]],
    }

    // Attach users listener
    useFirestoreConnect(() => [projectsQuery, usersProjectsQuery, ticketsQuery, usersQuery])

    // Get users_projects and project from redux state
    const users_projects = useSelector(
        ({ firestore: { data } }) => data.users_projects && data.users_projects[projectId]);

    const project = useSelector(
        ({ firestore: { data } }) => data.projects && data.projects[projectId]
    )

    const tickets = useSelector(
        ({ firestore: { ordered } }) => ordered.tickets 
    )

    let users = useSelector(
        ({ firestore: { data } }) => data.users
    )

    let tableUsersProjects = useSelector(selectTableUsersProjects);

    let tableTickets = useSelector(selectTableTickets);


    // Show a message while users are loading
    if (!isLoaded(project) || !isLoaded(users_projects) || !isLoaded(tickets) || !isLoaded(users)) {
        return 'Loading'
    }

    //reshape data to fit into DataTable
    //users
    let usersInProject;

    const userArray = users_projects.users;
    usersInProject = userArray.map(user => users[user]);

    usersInProject = Object.values(usersInProject);
    console.log(usersInProject)
    



    return (
        <div className='projectPage'>
            <div className='projectPageTop'>

                <div className='detail'>
                    <h5>Project Title:</h5>
                    <h2>{project.title}</h2>
                </div>
                <div className='detail'>
                    <h5>Project Description:</h5>
                    <h2>{project.body}</h2>
                </div>
            </div>

            
            
            {!isEmpty(users) ? 
               <DataTable data={usersInProject} tableProps={tableUsersProjects}/> : null
            }       

            
            {
                isLoaded(tickets) ? <DataTable data={tickets} tableProps={tableTickets}/> : null
                
            }   
           
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

