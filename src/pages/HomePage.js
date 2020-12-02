import React, {useEffect} from 'react'
import BarChart from '../components/BarChart/BarChart'
import CircularProgress from '@material-ui/core/CircularProgress';


import { useSelector, useDispatch } from 'react-redux'
import { useFirestoreConnect, isLoaded, populate } from 'react-redux-firebase'
import Paper from '@material-ui/core/Paper'

import './HomePage.scss';






function HomePage() {

    const ticketsQuery = {
        collection: 'tickets', 
    }

    // Attach listener
    useFirestoreConnect(() => [ticketsQuery])

    let tickets = useSelector(
        ({ firestore: { ordered } }) => ordered.tickets 
    )

    // Show a message while loading
    if (!isLoaded(tickets) ) {
        return <CircularProgress/>
    }

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
  




    return (
        <div className='HomePage'>
            <div className="innerWrapper">            
                <div className="col">
                    <BarChart type={0} data={priorityData}/>
                </div>
                <div className="col">
                    <BarChart type={1} data={typeData}/>
                </div>
                {/* <div className="col">
                    <BarChart/>
                </div>
                <div className="col">
                    <BarChart/>
                </div> */}
            </div>

           
        </div>
       
    )
}

export default HomePage