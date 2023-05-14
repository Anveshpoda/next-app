import { Button } from '@mui/material';
import { useState } from 'react';


const PostmanApi = ({ apis, env }) => {
    const [selectedApi, setSelectedApi] = useState(null);

    function randomColor() {
        let hex = Math.floor(Math.random() * 0xFFFFFF);
        let color = "#" + hex.toString(16);

        return color;
    }

    async function updatePostmanRequest(collectionId, requestId, authToken, request) {
        const url = `https://api.getpostman.com/collections/${collectionId}/requests/${requestId}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(request),
        });
        return response.json();
      }

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, padding:5 }}>
                <h1>API List</h1>
                {/* <ul> */}
                {apis?.map((api) => (
                    // <li key={api.id} style={{padding:5}}>
                    <Button key={api.id} style={{ margin: 5, backgroundColor:"blueviolet" }} variant='contained' onClick={() => setSelectedApi(api)}>{api.name}</Button>
                    // </li>
                ))}
                {/* </ul> */}
            </div>
            {selectedApi && (
                <div style={{ background: '#ffffff85', padding: 10 }}>
                    <h2>{selectedApi.name}</h2>
                    <a href={selectedApi.fullReq} target='_blank'>{selectedApi.fullReq}</a>
                    <p>{selectedApi.description}</p>
                    <pre style={{fontWeight:''}}>{JSON.stringify(selectedApi.request, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}


export const getServerSideProps = async (ctx) => {

 const apiKey = 'PMAT-01H0D10ETZ6HMM0306YFF8BW30';
 const apiKey1 = 'PMAK-6460c6d0d527a0002ad6ccff-0f7e4b42ea62c6d38b7025ac548496a779'


    const url = `https://api.getpostman.com/collections/${process.env.collectionId}`;
    
    // console.log('collectionId >> ',url)

    const response = await fetch(url, {
        headers: {
            'X-Api-Key': process.env.apiKey,
        },
    });

    const { collection } = await response.json();

    const environmentApiUrl = `https://api.getpostman.com/environments/${process.env.environmentId}`;
    const environmentApiResponse = await fetch(environmentApiUrl, {
        headers: {
            'X-Api-Key': process.env.apiKey,
        },
    });

    const { environment } = await environmentApiResponse.json();


    const env = environment?.values?.map((item) => ({
        key: item.key || '',
        value: item.value || '',
    }));



    const apis = collection?.item?.map((item) => {
        let api = {
            id: item.id || '',
            name: item.name || '',
            description: item.description || '',
            request: item.request || '',
            fullReq: item.request?.url?.raw || '',
        }

        if (api.fullReq && api.fullReq.match(/\{\{(.+?)\}\}/)) {
            // console.log(' TEST   >> ', api.request.url.raw.match(/\{\{(.+?)\}\}/)[1])
            api.fullReq = api.fullReq.replace(/\{\{(.+?)\}\}/g, (match, key) => {
                const value = env?.find((item) => item.key === key)?.value;
                return value ? value : match;
            });
        }
        return api
    });

    // console.log('environment >> ', apis[1])

    return {
        props: {
            apis: apis || null,
            env: env || null
        },
    };
}

export default PostmanApi;