import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actionTypes } from 'redux-firestore'
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import CircularProgress from '@material-ui/core/CircularProgress';

const userQuery = {
    collection: 'users', 
}

function ManageUsers() {
  const dispatch = useDispatch();
  useEffect(() => {
      return () => dispatch({ type: actionTypes.CLEAR_DATA })
  },[])
  
  // Attach users listener
  useFirestoreConnect(() => [userQuery])

  // Get users from redux state
  const users = useSelector(({ firestore: { ordered } }) => ordered.users)


  // Show a message while users are loading
  if (!isLoaded(users)) {
    return <CircularProgress/>
  }

  // Show a message if there are no users
  if (isEmpty(users)) {
    return 'No Data'
  }

  return users.map(({ id, displayName, ...todo }, ind) => (
    <h1 id={id}>{displayName}</h1>
  ))

}

export default ManageUsers