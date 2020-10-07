import React from 'react'
import { useSelector } from 'react-redux'
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'


const userQuery = {
    collection: 'users', 
}

function ManageUsers() {
  // Attach users listener
  useFirestoreConnect(() => [userQuery])

  // Get users from redux state
  const users = useSelector(({ firestore: { ordered } }) => ordered.users)


  // Show a message while users are loading
  if (!isLoaded(users)) {
    return 'Loading'
  }

  // Show a message if there are no users
  if (isEmpty(users)) {
    return 'Todo list is empty'
  }

  return users.map(({ id, displayName, ...todo }, ind) => (
    <h1 id={id}>{displayName}</h1>
  ))

}

export default ManageUsers