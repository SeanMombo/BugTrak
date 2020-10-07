import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

import tableSlice, {initialState as tablesInitial} from './tableSlice'

export const initialState = {
  tables: tablesInitial,
}

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  tables: tableSlice,
})

export default rootReducer;