import React from 'react'
import { useSelector } from 'react-redux'
import { useFirestoreConnect, useFirestore, isLoaded, isEmpty } from 'react-redux-firebase'
import { useParams } from 'react-router-dom'


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

    // Attach listener
    useFirestoreConnect(() => [ticketsQuery, commentsTicketsQuery, historyTicketsQuery])

    // Getfrom redux state
    const ticket = useSelector(
        ({ firestore: { data } }) => data.tickets && data.tickets[ticketId]
    )
    const comments = useSelector(
        ({ firestore: { ordered } }) => ordered.comments_ticket
    )
    const history = useSelector(
        ({ firestore: { ordered } }) => ordered.history_ticket
    )

    // Show a message while loading
    if (!isLoaded(ticket) || !isLoaded(comments)) {
        return 'Loading'
    }


    return (
        <div>
            <h1 id={ticket.id}>{ticket.title}</h1>
            <hr/>
            <ul>
                {
                    isLoaded(comments) ? 
                    comments.map(comment => {
                        if (comment.ticketId === ticketId)
                            return (
                            <li>
                               {comment.body}
                            </li>)

                        return;
                    }) : null
                }   
            </ul>     
            <hr/>
            <ul>
                {
                    //receipt properties: dateChanged, prevVal, val, property, ticketId
                    isLoaded(history) ? 
                    history.map(receipt => {
                        if (receipt.ticketId === ticketId)
                            return (
                            <li>
                               <h3>{receipt.property}</h3>
                               <h3>{receipt.prevVal}</h3>
                               <h3>{receipt.val}</h3>

                            </li>)

                        return;
                    }) : null
                }   
            </ul>     
        </div>
    )
    

}

export default TicketPage

