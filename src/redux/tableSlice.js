import { createSlice } from '@reduxjs/toolkit';

export const tableSlice = createSlice({
    name: 'tables',
    initialState: {
        projects: {
            headers: [
                { id: 'title', numeric: false, label: 'Title' },
                { id: 'body', numeric: false, label: 'Description' },
                { id: 'action', numeric: true, label: '' },  
              ],
              tableTitle: 'Projects',
              linkRoute: '/project/'
        },
        users_projects: {
            headers: [
                { id: 'displayName', numeric: false, label: 'Name' },
                { id: 'email', numeric: false, label: 'Email' },
                { id: 'userType', numeric: false, label: 'Role' },
                { id: 'action', numeric: true, label: '' },  

              ],
              tableTitle: 'Project Team',
              linkRoute: ''
        },
        tickets: {
            headers: [
                { id: 'title', numeric: false, label: 'Title' },
                { id: 'body', numeric: false, label: 'Description' },
                { id: 'assignedTo', numeric: false, label: 'Developer' },
                { id: 'status', numeric: false, label: 'Status' },
                { id: 'priority', numeric: false, label: 'Priority' },
                { id: 'action', numeric: true, label: '' },  

              ],
              tableTitle: 'Tickets',
              linkRoute: '/ticket/'
        },

        comments_ticket: {
            headers: [
                { id: 'displayName', numeric: false, label: 'Commentor' },
                { id: 'body', numeric: false, label: 'Message' },
                { id: 'dateCreated', numeric: false, label: 'Created' },
                { id: 'action', numeric: true, label: '' },  

              ],
              tableTitle: 'Comments',
              linkRoute: ''
        },
    },

})


//actions
// export const {} = tableSlice.actions;

//selectors
export const selectTableProject = state => state.tables.projects;
export const selectTableUsersProjects = state => state.tables.users_projects;
export const selectTableTickets = state => state.tables.tickets;
export const initialState = tableSlice.initialState;

//reducer
export default tableSlice.reducer;

