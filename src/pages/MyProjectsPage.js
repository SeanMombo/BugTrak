import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actionTypes } from 'redux-firestore'
import { useFirestoreConnect, isLoaded, isEmpty} from 'react-redux-firebase'
import CircularProgress from '@material-ui/core/CircularProgress';
import DataTable from '../components/DataTable.jsx'

import { selectTableProject } from '../redux/tableSlice';
import './ManageProjectsPage.scss';
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { tableTypes, userTypes } from '../constants'





function MyProjects() {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.firebase.auth)
    const profile = useSelector(state => state.firebase.profile)

    const projectQuery = {
        collection: 'projects', 
        
    }
    const usersProjectsQuery = {
        collection: 'users_projects', 
    }

    useEffect(() => {
        return () => dispatch({ type: actionTypes.CLEAR_DATA })
    },[])

    // Attach  listener
    useFirestoreConnect(() => [projectQuery, usersProjectsQuery])

 
    // Get from redux state
    let projects = useSelector(({ firestore: { data } }) => data.projects);
    let users_projects = useSelector(({ firestore: { ordered } }) => ordered.users_projects);

    const projectTableData = useSelector(selectTableProject)
    const modalOpen = useSelector(state => state.tables.modalOpen)
    
    
    // Show a message while loading
    if (!isLoaded(projects, users_projects, modalOpen, auth, profile)) {
        return <CircularProgress/>
    }

    // Show a message if there is no data
    if (isEmpty(projects)) {
        return 'No projects'
    }


    const p = [];
    users_projects.forEach(proj => {
        
        // console.log(proj['collaborators'], proj['id'], projects[proj['id']], auth.uid)
        if (proj['collaborators'].includes(auth.uid) || profile.userType === userTypes.admin) {
            const newObj = {...projects[proj['id']]};
            newObj['id'] = proj['id'];
            p.push(newObj)
        }
    })

    // console.log(p);

    return (
        <div>
            <Typography Typography variant="h4" component="h1">My Projects</Typography>
            <Divider/>
            <Paper className="manageProjectsPage" elevation={0}>

            
                {/* <div className="modalWrapper">
                    <Modal>
                        <CreateProjectForm/>
                    </Modal>
        
                </div> */}
                <div className="innerWrapper">
                    <div className="dataTableWrapper"> 
                        <DataTable key={p} data={p} tableProps={projectTableData} tableType={tableTypes.myprojects}/>
                    </div>
                </div>


            </Paper>

        </div>
    )
}

export default MyProjects