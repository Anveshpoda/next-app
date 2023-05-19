import React from 'react'

const ShowRequest = ({selectedApi}) => {

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
        <div style={{ flex: '1' }}>
            {selectedApi && (
                <div className='tranBg' style={{ padding: 10}}>
                    <h2>{selectedApi.name}</h2>
                    <a style={{fontSize:18, fontWeight:'bold'}} href={selectedApi.fullReq} target='_blank'>{selectedApi.fullReq}</a>
                    <p>{selectedApi.description}</p>
                    <pre style={{ fontWeight: '', fontSize:15 }}>{JSON.stringify(selectedApi.request, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}

export default ShowRequest