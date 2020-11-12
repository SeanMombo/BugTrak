import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actionTypes } from 'redux-firestore'
import { useFirestoreConnect, isLoaded, isEmpty} from 'react-redux-firebase'
import CircularProgress from '@material-ui/core/CircularProgress';
import DataTable from '../components/DataTable.jsx'
import { selectUsers } from '../redux/usersSlice';
import { selectTableTickets } from '../redux/tableSlice';
import './ManageProjectsPage.scss';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { tableTypes, userTypes } from '../constants'



function MyTickets() {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.firebase.auth)
    const profile = useSelector(state => state.firebase.profile)
    const users = useSelector(selectUsers) 

    const ticketQuery = {
        collection: 'tickets', 
        
    }
    const usersProjectsQuery = {
        collection: 'users_projects', 
    }

    useEffect(() => {
        return () => dispatch({ type: actionTypes.CLEAR_DATA })
    },[])

    // Attach  listener
    useFirestoreConnect(() => [ticketQuery, usersProjectsQuery])

 
    // Get from redux state
    let tickets = useSelector(({ firestore: { ordered } }) => ordered.tickets);
    let users_projects = useSelector(({ firestore: { ordered } }) => ordered.users_projects);

    const ticketTableData = useSelector(selectTableTickets)
    const modalOpen = useSelector(state => state.tables.modalOpen)
    
    
    // Show a message while loading
    if (!isLoaded(tickets, users_projects, modalOpen, users, profile, auth)) {
        return <CircularProgress/>
    }

    // Show a message if there is no data
    if (isEmpty(tickets)) {
        return 'No tickets'
    }

    // users_projects.forEach(proj => {
        
    //     console.log(proj['collaborators'], proj['id'], projects[proj['id']], auth.uid)
    //     if (proj['collaborators'].includes(auth.uid)) {
    //         const newObj = {...projects[proj['id']]};
    //         newObj['id'] = proj['id'];
    //         p.push(newObj)
    //     }
    // })

    const p = [];
    tickets.forEach(ticket => {
        if (ticket['submitter'] === auth.uid || ticket['assignee'] === auth.uid || profile.userType === userTypes.admin) {
            const newTicket = {...ticket};
            newTicket['submitter'] = users[newTicket['submitter']];
            newTicket['assignee'] = users[newTicket['assignee']];
            
            p.push(newTicket)
        }
    })

    // console.log(p);

    return (
        <div>
            <Typography variant="h4" component="h1">My Tickets</Typography>
            <Divider/>
            <Paper className="manageProjectsPage" elevation={0}>

                {/* <div className="modalWrapper">
                    <Modal>
                        <CreateProjectForm/>
                    </Modal>
                </div> */}
                <div className="innerWrapper">
                    <div className="dataTableWrapper"> 
                        <DataTable key={p} data={p} tableProps={ticketTableData} tableType={tableTypes.mytickets}/>
                    </div>
                </div>


            </Paper>

        </div>
    )
}

export default MyTickets