import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actionTypes } from 'redux-firestore'
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import CircularProgress from '@material-ui/core/CircularProgress';

import DataTable from '../components/DataTable'
import { selectTableProject } from '../redux/tableSlice';
import './manageProjectsPage.scss';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link,
    useHistory
} from "react-router-dom";


const projectQuery = {
    collection: 'projects', 
}

function ManageProjects() {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        return () => dispatch({ type: actionTypes.CLEAR_DATA })
    },[])

    // Attach  listener
    useFirestoreConnect(() => [projectQuery])

    // Get from redux state
    const projects = useSelector(({ firestore: { ordered } }) => ordered.projects)
    const projectTableData = useSelector(selectTableProject)
    

    // Show a message while loading
    if (!isLoaded(projects)) {
        return <CircularProgress/>
    }

    // Show a message if there is no data
    if (isEmpty(projects)) {
        return 'Todo list is empty'
    }

    return (
        <div className="manageProjectsPage">
            
            <div className="dataTableWrapper"> 
            <DataTable data={projects} tableProps={projectTableData}/>
            </div>
            <div className="dataTableWrapper"> <DataTable data={projects} tableProps={projectTableData}/> </div>
            
        </div>
    )
}

export default ManageProjects