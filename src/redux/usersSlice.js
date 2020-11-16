import { createSlice } from '@reduxjs/toolkit';
import { convertCollectionsSnapshotToMap, firestore } from '../firebase.utils';

//Storing the shape of data for DataTable, as well as some other relevant variables. 
//This allows me to use the same DataTable component, and allow it to support multiple data displays

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: '',
    },
    reducers: {
        fetchUsersStart: (state) => {
            state.loading = true;
        },
        fetchUserSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload;
        },
        fetchUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
})


export const fetchUsersStartAsync = () => {
    return dispatch => {
        const collectionRef = firestore.collection('users');
        dispatch(fetchUsersStart());

        collectionRef.get().then(snapshot => {
            const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
            dispatch(fetchUserSuccess(collectionsMap));
            
        }).catch(error => dispatch(fetchUserFailure(error.message)));
    }
}

//actions
export const { fetchUsersStart, fetchUserFailure, fetchUserSuccess } = usersSlice.actions;

//selectors
export const selectUsers = state => state.users.users;
export const initialState = usersSlice.initialState;

//reducer
export default usersSlice.reducer;

