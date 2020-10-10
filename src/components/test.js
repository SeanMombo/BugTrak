import React from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect, isLoaded, isEmpty, populate, useFirestoreConnect } from 'react-redux-firebase'

const populates = [
    { child: 'collaborators', root: 'users' }
  ]


function Test() {

  const query = {
    collection: 'users_projects', 
    doc: 'AorzcehRS5SbF5trdxPH',
    populates, 
  }

  useFirestoreConnect(() => [query]);

  const users_projects = useSelector(({ firestore }) => populate(firestore, "users_projects", populates));

  // Show message while todos are loading
  if (!isLoaded(users_projects)) {
    return <div>Loading...</div>
  }
  console.log(users_projects)


  // Show message if there are no todos
  if (isEmpty(users_projects)) {
    return <div>users_projects List Is Empty</div>
  }

  return (
    <div>
      <h1>Todos</h1>
      <div>
        {JSON.stringify(users_projects, null, 2)}
      </div>
    </div>
  )
}


export default (Test)