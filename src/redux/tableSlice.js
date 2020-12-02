import { createSlice } from '@reduxjs/toolkit';

//Storing the shape of data for DataTable, as well as some other relevant variables. 
//This allows me to use the same DataTable component, and allow it to support multiple data displays

export const tableSlice = createSlice({
    name: 'tables',
    initialState: {
        projects: {
            headers: [
                { id: 'title', numeric: false, label: 'Title' },
                { id: 'body', numeric: false, label: 'Description',},
                { id: 'action', numeric: true, label: '' },  
              ],
              tableTitle: 'Projects',
              buttonName: 'View Project',
              linkRoute: '/project/',
              delRoute: '/projects/'
        },
        users_projects: {
            headers: [
                { id: 'displayName', numeric: false, label: 'Name' },
                { id: 'email', numeric: false, label: 'Email' },
                { id: 'userType', numeric: false, label: 'Role' },
                { id: 'action', numeric: true, label: '' },  
              ],
              tableTitle: 'Project Team',
              buttonName: '',
              linkRoute: '/users_projects/'
        },
        users_table: {
            headers: [
                { id: 'displayName', numeric: false, label: 'Name' },
                { id: 'email', numeric: false, label: 'Email' },
                { id: 'userType', numeric: false, label: 'Role' },

              ],
              tableTitle: 'All Users',
              buttonName: '',
              linkRoute: '/users_table/'
        },
        tickets_projects: {
            headers: [
                { id: 'title', numeric: false, label: 'Title' },
                { id: 'assignee', numeric: false, label: 'Assignee' },
                { id: 'status', numeric: false, label: 'Status' },
                { id: 'priority', numeric: false, label: 'Priority' },
                // { id: 'dateCreated', numeric: false, label: 'Date Created' },
                { id: 'action', numeric: true, label: '' },  

              ],
              tableTitle: 'Tickets',
              buttonName: 'View Ticket',
              linkRoute: '/ticket/'
        },
        tickets: {
            headers: [
                { id: 'title', numeric: false, label: 'Title' },
                { id: 'projectId', numeric: false, label: 'Project' },
                { id: 'assignee', numeric: false, label: 'Developer' },
                { id: 'status', numeric: false, label: 'Status' },
                { id: 'priority', numeric: false, label: 'Priority' },
                { id: 'dateCreated', numeric: false, label: 'Date Created' },
                { id: 'action', numeric: true, label: '' },  
              ],
              tableTitle: 'Tickets',
              buttonName: 'View Ticket',
              linkRoute: '/ticket/'
        },
        comments_ticket: {
            headers: [
                { id: 'submitter', numeric: false, label: 'Commentor' },
                { id: 'body', numeric: false, label: 'Message' },
                { id: 'dateCreated', numeric: false, label: 'Created' },
                // { id: 'action', numeric: true, label: '' },  
              ],
              tableTitle: 'Comments',
              buttonName: '',
              linkRoute: ''
        },
        history_ticket: {
            headers: [
                { id: 'property', numeric: false, label: 'Property' },  
                { id: 'prevVal', numeric: false, label: 'Previous Value' },
                { id: 'val', numeric: false, label: 'Current Value' },
                { id: 'dateEdited', numeric: false, label: 'Date Changed' },
                // { id: 'action', numeric: true, label: '' },  
              ],
              tableTitle: 'Ticket History',
              buttonName: '',
              linkRoute: ''
        },
        snackbarOpen: false,
        snackbarMessage: '',
        // severity="error">
        // severity="warning">
        // severity="info">
        // severity="success">
        snackbarType: 'success',

        modalOpen: false,
        modalCommentsOpen: false,
        
    },
    
    reducers: {
        toggleModal(state, action) {
            const bool = action.payload;
            state.modalOpen = bool;
        },
        toggleCommentsModal(state, action) {
            const bool = action.payload;
            state.modalCommentsOpen = bool;
        },
        toggleSnackbar(state, action) {
            const [bool, type, message] = action.payload;
            state.snackbarOpen = bool;
            state.snackbarMessage = message;
            state.snackbarType = type;
        },
    }
})


//actions
export const { toggleModal, toggleCommentsModal, toggleSnackbar } = tableSlice.actions;

//selectors
export const selectTableProject = state => state.tables.projects;
export const selectTableUsersProjects = state => state.tables.users_projects;
export const selectTableUsersTable = state => state.tables.users_table;
export const selectTableTicketsProjects = state => state.tables.tickets_projects;
export const selectTableTickets = state => state.tables.tickets;
export const selectTableHistoryTicket = state => state.tables.history_ticket;
export const selectTableCommentsTicket = state => state.tables.comments_ticket;
export const selectSnackbar = state => state.tables.snackbarOpen;
export const initialState = tableSlice.initialState;

//reducer
export default tableSlice.reducer;

