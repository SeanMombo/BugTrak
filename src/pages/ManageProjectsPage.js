import React from 'react'
import { useSelector } from 'react-redux'
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'

import DataTable from '../components/DataTable'
import { selectTableProject } from '../redux/tableSlice';

// import {
//     useRouteMatch,
//   } from "react-router-dom";

const projectQuery = {
    collection: 'projects', 
}

function ManageProjects() {
    // let match = useRouteMatch();

    // Attach  listener
    useFirestoreConnect(() => [projectQuery])

    // Get from redux state
    const projects = useSelector(({ firestore: { ordered } }) => ordered.projects)
    const projectTableData = useSelector(selectTableProject)
    

    // Show a message while loading
    if (!isLoaded(projects)) {
        return 'Loading'
    }

    // Show a message if there is no data
    if (isEmpty(projects)) {
        return 'Todo list is empty'
    }

    // return projects.map(({ id, title, ...todo }, ind) => (
    //     <h1 id={id}>{title}</h1>
    // ))

    return (
        <div>
            <DataTable data={projects} tableProps={projectTableData}/>
{/* 
            <Switch>                
                <Route path={match.path}>
                </Route>
            </Switch> */}
        </div>


    )
}

export default ManageProjects