import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Grid, Paper, Checkbox, FormControlLabel, Tabs, Tab } from '@mui/material';

const ShowRequest = ({ selectedApi }) => {
    const [requestParams, setRequestParams] = useState(selectedApi?.request?.url?.query || []);
    const [fullReq, setFullReq] = useState(selectedApi?.fullReq || '');
    const [authToken, setAuthToken] = useState('');
    const [response, setResponse] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (selectedApi) {
            setRequestParams(selectedApi.request?.url?.query || []);
            setFullReq(selectedApi.fullReq || '');
        }
    }, [selectedApi]);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newRequestParams = [...requestParams];
        newRequestParams[index][name] = value;
        setRequestParams(newRequestParams);
        updateFullReqUrl(newRequestParams);
    };

    const handleCheckboxChange = (index, event) => {
        const newRequestParams = [...requestParams];
        newRequestParams[index].checked = event.target.checked;
        setRequestParams(newRequestParams);
    };

    const updateFullReqUrl = (params) => {
        let url = selectedApi.request.url.raw;
        params.forEach(param => {
            url = url.replace(new RegExp(`{{${param.key}}}`, 'g'), param.value);
        });
        setFullReq(url);
    };

    const handelSendReq = async () => {
        try {
            let res = await fetch(fullReq, {
                method: selectedApi.request.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            res = await res.json();

            setResponse(res);
            setTabValue(1);
            console.log('Request sent successfully:', res);
        } catch (error) {
            console.error('Error sending request:', error);
        }

    }

    const handleTabChange = (event, newValue) => setTabValue(newValue);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedRequest = {
            ...selectedApi.request,
            url: {
                ...selectedApi.request.url,
                query: requestParams,
            },
        };
        try {
            const response = await updatePostmanRequest(selectedApi.collectionId, selectedApi.id, authToken, updatedRequest);
            console.log('Request updated successfully:', response);
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    const updatePostmanRequest = async (collectionId, requestId, authToken, request) => {
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
    };

    return (
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={2}>
                {selectedApi && (
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.85)', marginBottom: '20px' }}>
                            <Typography variant="h4" gutterBottom>{selectedApi.name}</Typography>
                            <a style={{ fontSize: 18, fontWeight: 'bold', wordBreak: 'break-all' }} href={fullReq} target='_blank' rel="noopener noreferrer">{fullReq}</a>
                            <Typography variant="body1" paragraph>{selectedApi.description}</Typography>
                            <form onSubmit={handleSubmit}>
                                <Typography variant="h6" gutterBottom>Edit Parameters</Typography>
                                <Grid container spacing={2}>
                                    {requestParams.map((param, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={1}>
                                                <FormControlLabel label="" control={<Checkbox checked={param.checked || false} onChange={(e) => handleCheckboxChange(index, e)} />} />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField label="Key" name="key" value={param.key} onChange={(e) => handleInputChange(index, e)} margin="normal" fullWidth />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField label="Value" name="value" value={param.value} onChange={(e) => handleInputChange(index, e)} margin="normal" fullWidth />
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                    <Grid item xs={12}>
                                        <TextField label="Auth Token" value={authToken} onChange={(e) => setAuthToken(e.target.value)} margin="normal" fullWidth />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button variant="contained" color="primary" fullWidth onClick={() => handelSendReq()}>Send Reuest</Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button variant="contained" color="primary" fullWidth>Update Request</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.85)', flex: '1' }}>
                        <Typography variant="h6" gutterBottom>Request Details</Typography>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab label="Request" />
                            <Tab label="Response" />
                        </Tabs>
                        {tabValue === 0 && (
                            <pre style={{ fontWeight: '', fontSize: 15, overflowX: 'auto', backgroundColor: '#f5f5f5', padding: '10px' }}>
                                {JSON.stringify(selectedApi?.request, null, 2)}
                            </pre>
                        )}
                        {tabValue === 1 && (
                            <pre style={{ fontWeight: '', fontSize: 15, overflowX: 'auto', backgroundColor: '#f5f5f5', padding: '10px' }}>
                                {response ? JSON.stringify(response, null, 2) : 'No response data'}
                            </pre>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default ShowRequest;
