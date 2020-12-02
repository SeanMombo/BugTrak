import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actionTypes } from 'redux-firestore'
import { useFirestoreConnect, isLoaded, populate } from 'react-redux-firebase'
import { useParams } from 'react-router-dom';
import { tableTypes } from '../constants.js'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import BackButton from '../components/BackButton'
import DataTable from '../components/DataTable.jsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '../components/Modal/Modal.jsx'
import EditTicketForm from '../components/EditTicketForm'


import { selectTableHistoryTicket, selectTableCommentsTicket } from '../redux/tableSlice';
import { selectUsers } from '../redux/usersSlice'
import { statuses, priorities, types, } from '../constants';
import './TicketPage.scss';


const commentsPopulate = [
    { child: 'submitter', root: 'users' }
];

function TicketPage() {
    const { ticketId } = useParams() // matches todos/:todoId in route
    const dispatch = useDispatch();
    
    useEffect(() => {
        return () => dispatch({ type: actionTypes.CLEAR_DATA })
    },[dispatch])

    const ticketsQuery = {
        collection: 'tickets', 
    }
    const projectsQuety = {
        collection: 'projects',     
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
    useFirestoreConnect(() => [ticketsQuery, commentsTicketsQuery, historyTicketsQuery, projectsQuety])

    // Getfrom redux state
    let ticket = useSelector(
        ({ firestore: { data } }) => data.tickets && data.tickets[ticketId]
    )
    let comments = useSelector(({ firestore }) => populate(firestore, 'comments_ticket', commentsPopulate));

    const history = useSelector(
        ({ firestore: { ordered } }) => ordered.history_ticket
    )

    const projects = useSelector(
        ({ firestore: { ordered } }) => ordered.projects
    )

    const projectsData = useSelector(
        ({ firestore: { data } }) => data.projects
    )

    const users = useSelector(selectUsers);
    
    const historyTicketTable = useSelector(selectTableHistoryTicket);
    const commentsTicketTable = useSelector(selectTableCommentsTicket);

    // Show a message while loading
    if (!isLoaded(ticket, comments, history, historyTicketTable, commentsTicketTable, projects, projectsData) ) {
        return <CircularProgress/>
    }

    if (comments)
        comments = Object.keys(comments).map(key => {comments[key].id = key; return comments[key]});
    else 
        comments = [];

    // //convert assignee and submitter IDs into user displayName's,
    
    let assigneeName = 'unassigned';
    let submitterName = 'unassigned';

    if (ticket.assignee !== 'unassigned') {
        assigneeName = users[ticket.assignee].displayName;
    }
    if (ticket.submitter !== 'unassigned') {
        submitterName = users[ticket.submitter].displayName;
    }


    console.log(ticket, 'TICKEEEEEET');

    // const dateStrings = ['dateEdited', 'dateCreated'];
    ticket = {...ticket}
    if (ticket) {
        ticket.dateCreated = new Date(ticket.dateCreated.seconds * 1000 + ticket.dateCreated.nanoseconds / 1000000);
        ticket.dateCreated = ticket.dateCreated.toISOString().split('T')[0];
       
        // ticket.dateEdited = new Date(ticket.dateEdited.seconds * 1000 + ticket.dateEdited.nanoseconds / 1000000);
        // ticket.dateEdited = ticket.dateEdited.toISOString().split('T')[0];

        ticket.id = ticketId
    }


    return (
        <div>
            <Typography className='title' variant="h4" component="h1">Ticket Details</Typography> 
            <br/>
            <BackButton/>
            <Divider/>
            
            <div className="ticketPage">
                <div className="topRow">

                    <Card className='ticketCard' elevation={3}>
                        {/* <CardHeader component='div' className='cardHeader' title='Details' titleTypographyProps={{variant:'h6', component:'h6'}}>
                            <BackButton/>
                        </CardHeader> */}
                        <Paper square elevation={1} className='cardHeader'>
                            <Typography className='greyText2' variant='h6' component='h6'>Ticket</Typography>
                            <Modal title="Edit Ticket"><EditTicketForm projects={projects} ticket={ticket} users={users}/></Modal>
                        </Paper>

                        <div className='cardContent' >
                            <div className="cardLeft">
                                
                              
                                    {/* <Typography className='greyText'variant='caption' component='p' gutterBottom>Title</Typography> */}
                                    {/* <Typography className='greyText' variant='caption' component='p' gutterBottom>Title</Typography> */}

                       
                                <Typography className='titleText' variant='h5' component='h5' gutterBottom >{ticket.title}</Typography>

                                <br/>
                                
                                <Typography className='greyText' variant='caption' component='p' gutterBottom>Description</Typography>
                                <Typography component='p' gutterBottom >{ticket.body}</Typography>
                                <br/>
                                
                            </div>
                            <div> <Divider orientation="vertical"/></div>
                            <div className="cardRight">

                            
                                <div className="attributeContainer">
                                    <Typography className='greyText' variant='caption' component='p' gutterBottom>Project</Typography>
                                    <Typography className='greyText2' gutterBottom >{projectsData[ticket.projectId].title}</Typography>  
                                </div>
                                <div className="attributeContainer">
                                    <Typography className='greyText'variant='caption' component='p' gutterBottom>Assignee</Typography>
                                    <Typography className='greyText2'  component='p' gutterBottom >{assigneeName}</Typography>
                                </div>
                                <div className="attributeContainer">
                                    <Typography className='greyText'variant='caption' component='p' gutterBottom>Submitter</Typography>
                                    <Typography className='greyText2'  component='p' gutterBottom >{submitterName}</Typography>
                                </div>
                                <Divider/><br/>
                                <div className="attributeContainer">
                                    <Typography className='greyText'variant='caption' component='p' gutterBottom>Status</Typography>
                                    <Typography className='greyText2'  component='p' gutterBottom >{statuses[ticket.status]}</Typography>
                                </div>
                                <div className="attributeContainer">
                                    <Typography className='greyText'variant='caption' component='p' gutterBottom>Priority</Typography>
                                    <Typography className='greyText2'  component='p' gutterBottom >{priorities[ticket.priority]}</Typography>
                                </div>
                                <div className="attributeContainer">
                                    <Typography className='greyText'variant='caption' component='p' gutterBottom>Type</Typography>
                                    <Typography className='greyText2'  component='p' gutterBottom >{types[ticket.type]}</Typography>
                                </div>

                                <Divider/><br/>
                                
                                <div className="attributeContainer">
                                    <Typography className='greyText'variant='caption' component='p' gutterBottom>Date Created</Typography>
                                    <Typography className='greyText2'component='p' gutterBottom >{`${ticket.dateCreated}`}</Typography>
                                </div>
                                {/* <div className="attributeContainer">
                                    <Typography className='greyText'variant='caption' component='p' gutterBottom>Date Edited</Typography>
                                    <Typography className='greyText2' component='p' gutterBottom >{`${ticket.dateEdited}`}</Typography>
                                </div> */}
                            </div>

                        </div>
                    </Card>
                    <div className="dataTable">
                        <DataTable data={history} key={history} tableProps={historyTicketTable} tableType={tableTypes.history_tickets}/>
                    </div>
                </div>

                <div className="bottomRow">
                    <DataTable data={comments} key={comments} tableProps={commentsTicketTable} tableType={tableTypes.comments}/>         
                </div>

            </div>
        </div>
    )

}

export default TicketPage

