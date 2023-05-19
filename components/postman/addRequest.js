import { Button, MenuItem, TextField, makeStyles } from '@mui/material';
import { useState } from 'react';
// import { makeStyles } from '@mui/styles'

const AddRequestForm = ({ collectionId, authToken, onAddRequest }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [body, setBody] = useState('');


    // const useStyles = makeStyles((theme) => ({
    //     form: {
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         '& > *': {
    //             margin: theme.spacing(1),
    //         },
    //     },
    // }));



    async function addPostmanRequest(collectionId, authToken, request) {
        console.log('process.env.collectionId >> ', process.env.collectionId)
        const url = `https://api.getpostman.com/collections/${collectionId}/requests`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(request),
        });
        return response.json();
    }

    const handleAddRequest = async (event) => {
        event.preventDefault();
        try {
            const addedRequest = await addPostmanRequest(process.env.collectionId, process.env.apiKey, { name, url, method, body, headers });
            console.log('Request added:', addedRequest);

        } catch (error) { console.error('Error adding request:', error) }
    };

    return (
        <form style={{ padding: 10, backgroundColor: '#ffffff85' }} onSubmit={handleAddRequest}>
            <TextField className='m-5' label="Name" value={name} onChange={(event) => setName(event.target.value)} />
            <TextField className='m-5' select label="Method" value={method} onChange={(event) => setMethod(event.target.value)}>
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
            </TextField><br />
            <TextField className='m-5' label="URL" value={url} onChange={(event) => setUrl(event.target.value)} /><br />



            {method === 'POST' && <>
                <TextField className='m-5'
                    multiline
                    minRows={4}
                    variant="outlined"
                    label="Body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                /> <br />
            </>}

            <Button className='m-5' variant="contained" color="primary" type="submit">
                Add Request
            </Button><br />

            {/* <div>
                <label>
                    Headers:
                    <textarea value={JSON.stringify(request.headers)} onChange={(event) => setRequest({ ...request, headers: JSON.parse(event.target.value) })}></textarea>
                </label>
            </div>
            <div>
                <label>
                    Body:
                    <textarea value={JSON.stringify(request.body)} onChange={(event) => setRequest({ ...request, body: JSON.parse(event.target.value) })}></textarea>
                </label>
            </div>
            <div>
                <button type="submit">Add Request</button>
            </div> */}
        </form>
    );
};

export default AddRequestForm;