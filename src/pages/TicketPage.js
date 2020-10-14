import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actionTypes } from 'redux-firestore'
import { useFirestoreConnect, isLoaded, populate } from 'react-redux-firebase'
import { useParams } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';


import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider'

import DataTable from '../components/DataTable.jsx';
import CircularProgress from '@material-ui/core/CircularProgress';


import { selectTableHistoryTicket, selectTableCommentsTicket } from '../redux/tableSlice';

import './TicketPage.scss';


const commentsPopulate = [
    { child: 'submitter', root: 'users' }
];

function TicketPage() {
    const { ticketId } = useParams() // matches todos/:todoId in route
    const dispatch = useDispatch();
    
    useEffect(() => {
        return () => dispatch({ type: actionTypes.CLEAR_DATA })
    },[])

    const ticketsQuery = {
        collection: 'tickets',     
    }

    const commentsTicketsQuery = {
        collection: 'comments_ticket',  
        where: [['ticketId', '==', ticketId]],  
        populates: commentsPopulate, 
    } 
    const historyTicketsQuery = {
        collection: 'history_ticket',  
        where: [['ticketId', '==', ticketId]],   
    }


    // Attach listener
    useFirestoreConnect(() => [ticketsQuery, commentsTicketsQuery, historyTicketsQuery])

    // Getfrom redux state
    let ticket = useSelector(
        ({ firestore: { data } }) => data.tickets && data.tickets[ticketId]
    )
    let comments = useSelector(({ firestore }) => populate(firestore, 'comments_ticket', commentsPopulate));

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
        ) {
        return <CircularProgress/>
    }

    if (comments)
        comments = Object.keys(comments).map(key => {comments[key].id = key; return comments[key]});
    else 
        comments = [];

    //convert assignee and submitter IDs into user displayName's,
    // const assigneeName = users[ticket.assignee].displayName;
    // const submitterName = users[ticket.submitter].displayName;

    const dateStrings = ['dateEdited', 'dateCreated'];

    if (ticket) {
        ticket.dateCreated = new Date(ticket.dateCreated.seconds * 1000 + ticket.dateCreated.nanoseconds/1000000);
        ticket.dateCreated = ticket.dateCreated.toISOString().split('T')[0];
       
        ticket.dateEdited = new Date(ticket.dateEdited.seconds * 1000 + ticket.dateEdited.nanoseconds/1000000);
        ticket.dateEdited = ticket.dateEdited.toISOString().split('T')[0];
    }
  


    return (
        <div className="ticketPage">
            <div className="topRow">

                <Card className='ticketCard' elevation={3}>
                    <CardHeader className='cardHeader' title='Details' titleTypographyProps={{variant:'h6', component:'h6'}}></CardHeader>
                    
                    <div className='cardContent' >
                        <div className="cardLeft">
                            
                            <div className="attributeContainer">
                                {/* <Typography className='greyText'variant='caption' component='p' gutterBottom>Title</Typography> */}
                                <Typography className='greyText2' variant='h5' component='h5' gutterBottom >{ticket.title}</Typography>
                            </div>
                            <br/>
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
                <div className="dataTable">
                    <DataTable data={history} tableProps={historyTicketTable}/>

                </div>
            </div>

            
            <div className="bottomRow">
                <DataTable data={comments} tableProps={commentsTicketTable}/>         
            </div>


            
        </div>
    )
    

}

export default TicketPage

