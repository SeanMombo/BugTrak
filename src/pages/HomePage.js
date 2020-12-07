import React, {useEffect} from 'react'
import BarChart from '../components/BarChart/BarChart'
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider'
import { selectUsers } from '../redux/usersSlice';

import { useSelector, useDispatch } from 'react-redux'
import { useFirestoreConnect, isLoaded, populate } from 'react-redux-firebase'
import { tableTypes, userTypes, userConversion } from '../constants'

import './HomePage.scss';


function HomePage() {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.firebase.auth)
    const profile = useSelector(state => state.firebase.profile)
    const users = useSelector(selectUsers) 

    const ticketsQuery = {
        collection: 'tickets', 
    }
    const projectsQuery = {
      collection: 'projects',  
    }
    const usersProjectsQuery = {
      collection: 'users_projects', 
    }
    // Attach listener
    useFirestoreConnect(() => [ticketsQuery, usersProjectsQuery, projectsQuery])
    let users_projects = useSelector(({ firestore: { ordered } }) => ordered.users_projects);
    let projects = useSelector(({ firestore: { data } }) => data.projects);

    let allTickets = useSelector(
        ({ firestore: { ordered } }) => ordered.tickets 
    )

    // Show a message while loading
    if (!isLoaded(allTickets, users_projects, projects) ) {
        return <CircularProgress/>
    }

    const tickets = [];
    allTickets.forEach(ticket => {
        // If project manager, find if ticket is part of project PM is assigned to manage
        var pmOwnership = false;
        users_projects.forEach(proj => {
            if (proj['collaborators'].includes(auth.uid) && proj['id'] === ticket['projectId']) {
                pmOwnership = true;
            }
        });

        //Show different tickets depending on account type
        if (ticket['submitter'] === auth.uid 
        || ticket['assignee'] === auth.uid 
        || profile.userType === userTypes[userConversion.admin]
        || (profile.userType === userTypes[userConversion.pm] && pmOwnership)) {
            
            const newTicket = {...ticket};
            newTicket['submitter'] = users[newTicket['submitter']];
            newTicket['assignee'] = users[newTicket['assignee']];

            newTicket['projectId'] = projects[newTicket['projectId']].title ? projects[newTicket['projectId']].title : newTicket['projectId'];
            tickets.push(newTicket)
        }
    })


  // create priority data for bar chart
  const priorityCounts = {};
  tickets.forEach(ticket => {
    if (!(priorityCounts[ticket.priority])) {
      priorityCounts[ticket.priority] = 0;
    }
    priorityCounts[ticket.priority]++;
  })

  const priorityData = [
    { index: 'none', none: 0 },
    { index: 'low', low: 0 },
    { index: 'med', med: 0 },
    { index: 'high', high: 0 }
  ];
  priorityData[0].none = priorityCounts['none'] === undefined ? 0 : priorityCounts['none'];
  priorityData[1].low = priorityCounts['low'] === undefined ? 0 : priorityCounts['low'];
  priorityData[2].med = priorityCounts['medium'] === undefined ? 0 : priorityCounts['medium'];
  priorityData[3].high = priorityCounts['high'] === undefined ? 0 : priorityCounts['high'];
  ////////////////////////////////////////////

  // create type data for bar chart
  const typeCounts = {};
  tickets.forEach(ticket => {
    if (!(typeCounts[ticket.type])) {
      typeCounts[ticket.type] = 0;
    }
    typeCounts[ticket.type]++;
  })

  const typeData = [
    { index: 'bug', bug: 0 },
    { index: 'featureReq', featureReq: 0 },
    { index: 'docReq', docReq: 0 },
    { index: 'other', other: 0 }
  ];
  typeData[0].bug = typeCounts['bug'] === undefined ? 0 : typeCounts['bug'];
  typeData[1].featureReq = typeCounts['featureReq'] === undefined ? 0 : typeCounts['featureReq'];
  typeData[2].docReq = typeCounts['docReq'] === undefined ? 0 : typeCounts['docReq'];
  typeData[3].other = typeCounts['other'] === undefined ? 0 : typeCounts['other'];
  ////////////////////////////////////////////

  // create status data for bar chart
  const statusCounts = {};
  tickets.forEach(ticket => {
    if (!(statusCounts[ticket.status])) {
      statusCounts[ticket.status] = 0;
    }
    statusCounts[ticket.status]++;
  })

  const statusData = [
    { index: 'new', new: 0 },
    { index: 'open', open: 0 },
    { index: 'active', active: 0 },
    { index: 'resolved', resolved: 0 }
  ];

  statusData[0].new = statusCounts['new'] === undefined ? 0 : statusCounts['new'];
  statusData[1].open = statusCounts['open'] === undefined ? 0 : statusCounts['open'];
  statusData[2].active = statusCounts['active'] === undefined ? 0 : statusCounts['active'];
  statusData[3].resolved = statusCounts['resolved'] === undefined ? 0 : statusCounts['resolved'];
  console.log(statusData)
  ////////////////////////////////////////////

    return (
      <>
      <Typography variant="h4" component="h1">Dashboard</Typography>
      <Divider/>
        <div className='HomePage'>
          
            <div className="innerWrapper">            
                <div className="col">
                    <BarChart type={0} data={priorityData}/>
                </div>
                <div className="col">
                    <BarChart type={2} data={statusData}/>
                </div>
                <div className="col">
                  <BarChart type={1} data={typeData}/>

                </div>
          
            </div>

           
        </div>
       </>
    )
}

export default HomePage