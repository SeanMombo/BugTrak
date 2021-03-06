import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFirestoreConnect, isLoaded, isEmpty, populate } from 'react-redux-firebase'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

// const options = ['Option 1', 'Option 2'];

export default function UserAutocomplete() {
    const dispatch = useDispatch();

    const [value, setValue] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');


    const usersQuery = {
        collection: 'users', 
    }

    // Attach users listener
    useFirestoreConnect(() => [usersQuery])

    const users = useSelector(
        ({ firestore: { ordered } }) => ordered.users 
    )

    if (!isLoaded(users)) 
        return 'loading'

    let options = (users).map(user => {
        return user['displayName']
    })

    return (
    <div>
        <div>{`value: ${value !== null ? `'${value}'` : 'null'}`}</div>
        <div>{`inputValue: '${inputValue}'`}</div>
        <br />
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            autoComplete={true}
            autoSelect={true}
            autoHighlight={true}
            id="controllable-states-demo"
            options={options}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Controllable"  />}
        />
    </div>
    );
}