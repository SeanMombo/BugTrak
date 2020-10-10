import React from 'react'
import { useSelector } from 'react-redux'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import { useParams } from 'react-router-dom';
import { truncateString } from '../utils';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider'
// import Paper from '@material-ui/core/Paper'
import DataTable from '../components/DataTable';

// import CommentCard from '../components/CommentCard/CommentCard';
import { selectTableHistoryTicket, selectTableCommentsTicket } from '../redux/tableSlice';

import './TicketPage.css';

function TicketPage() {
    const { ticketId } = useParams() // matches todos/:todoId in route

    const ticketsQuery = {
        collection: 'tickets',     
    }

    const commentsTicketsQuery = {
        collection: 'comments_ticket',  
        where: [['ticketId', '==', ticketId]],   
    } 
    const historyTicketsQuery = {
        collection: 'history_ticket',  
        where: [['ticketId', '==', ticketId]],   
    }
    // const usersQuery = {
    //     collection: 'users', 
    // }

    


    // Attach listener
    
    useFirestoreConnect(() => [ticketsQuery, commentsTicketsQuery, historyTicketsQuery])
    let users = useSelector(
        ({ firestore: { data } }) => data.users
    )

    // Getfrom redux state
    let ticket = useSelector(
        ({ firestore: { data } }) => data.tickets && data.tickets[ticketId]
    )
    const comments = useSelector(
        ({ firestore: { ordered } }) => ordered.comments_ticket
    )
    const history = useSelector(
        ({ firestore: { ordered } }) => ordered.history_ticket
    )
    

    const historyTicketTable = useSelector(selectTableHistoryTicket);
    const commentsTicketTable = useSelector(selectTableCommentsTicket);

    // Show a message while loading
    if (!isLoaded(ticket) 
        || !isLoaded(comments) 
        || !isLoaded(history) 
        || !isLoaded(historyTicketTable) 
        || !isLoaded(commentsTicketTable)
        || !isLoaded(users)) {
        return 'Loading'
    }

    //convert assignee and submitter IDs into user displayName's,
    // const assigneeName = users[ticket.assignee].displayName;
    // const submitterName = users[ticket.submitter].displayName;

    return (
        <div className="ticketPage">
            <div className="topRow">

            <Card className='ticketCard'>
                <CardHeader className='cardHeader' title={ticket.title}>
                    </CardHeader>
                    <div className='cardContent'>
                        <div className="cardLeft">

                                <Typography className='greyText' variant='caption' component='p' gutterBottom>Description</Typography>
                                <Typography  variant='p' component='p' gutterBottom >{ticket.body}</Typography>
                    
                           
                                
                        </div>
                        <div> <Divider orientation="vertical"/></div>
                        <div className="cardRight">
                            <div className="attributeContainer">
                                <Typography className='greyText'variant='caption' component='p' gutterBottom>Status</Typography>
                                <Typography className='greyText2' variant='p' component='p' gutterBottom >{ticket.status}</Typography>
                            </div>
                            <div className="attributeContainer">
                                <Typography className='greyText'variant='caption' component='p' gutterBottom>Priority</Typography>
                                <Typography className='greyText2' variant='p' component='p' gutterBottom >{ticket.priority}</Typography>
                            </div>
                            <div className="attributeContainer">
                                <Typography className='greyText'variant='caption' component='p' gutterBottom>Type</Typography>
                                <Typography className='greyText2' variant='p' component='p' gutterBottom >{ticket.type}</Typography>
                            </div>
                            {/* <div className="attributeContainer">
                                <Typography className='greyText'variant='caption' component='p' gutterBottom>Assignee</Typography>
                                <Typography className='greyText2' variant='p' component='p' gutterBottom >{assigneeName}</Typography>
                            </div>
                            <div className="attributeContainer">
                                <Typography className='greyText'variant='caption' component='p' gutterBottom>Submitter</Typography>
                                <Typography className='greyText2' variant='p' component='p' gutterBottom >{submitterName}</Typography>
                            </div> */}

                            <Divider/><br/>
                            
                            
                            <div className="attributeContainer">
                                <Typography className='greyText'variant='caption' component='p' gutterBottom>Date Created</Typography>
                                <Typography className='greyText2' variant='p' component='p' gutterBottom >{`${ticket.dateCreated}`}</Typography>
                            </div>
                            <div className="attributeContainer">
                                <Typography className='greyText'variant='caption' component='p' gutterBottom>Date Edited</Typography>
                                <Typography className='greyText2' variant='p' component='p' gutterBottom >{`${ticket.dateEdited}`}</Typography>
                            </div>
                        </div>

                    </div>
                </Card>

                <DataTable data={history} tableProps={historyTicketTable}/>
            </div>

            
            <div className="bottomRow">
                <DataTable data={comments} tableProps={commentsTicketTable}/>         
            </div>


            
        </div>
    )
    

}

export default TicketPage

