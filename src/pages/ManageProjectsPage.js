import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actionTypes } from 'redux-firestore'
import { useFirestoreConnect, isLoaded, isEmpty} from 'react-redux-firebase'
import CircularProgress from '@material-ui/core/CircularProgress';
import DataTable from '../components/DataTable.jsx'

import { selectTableProject } from '../redux/tableSlice';
import './ManageProjectsPage.scss';
import Paper from '@material-ui/core/Paper'
import { tableTypes } from '../constants'



const projectQuery = {
    collection: 'projects', 
}

function ManageProjects() {

    const dispatch = useDispatch();


    useEffect(() => {
        return () => dispatch({ type: actionTypes.CLEAR_DATA })
    },[])

    // Attach  listener
    useFirestoreConnect(() => [projectQuery])

 
    // Get from redux state
    let projects = useSelector(({ firestore: { ordered } }) => ordered.projects)
    const projectTableData = useSelector(selectTableProject)
    const modalOpen = useSelector(state => state.tables.modalOpen)
    
    
    // Show a message while loading
    if (!isLoaded(projects, modalOpen)) {
        return <CircularProgress/>
    }

    // Show a message if there is no data
    if (isEmpty(projects)) {
        return 'Todo list is empty'
    }

    return (
        <Paper className="manageProjectsPage" elevation={0}>
            {/* <div className="modalWrapper">
                <Modal>
                    <CreateProjectForm/>
                </Modal>
            </div> */}
            <div className="innerWrapper">
                <div className="dataTableWrapper"> 
                    <DataTable key={projects} data={projects} tableProps={projectTableData} tableType={tableTypes.projects}/>
                </div>
            </div>


        </Paper>
    )
}

export default ManageProjects