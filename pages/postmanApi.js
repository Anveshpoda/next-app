import AddRequestForm from '@/components/postman/addRequest';
import ShowRequest from '@/components/postman/showRequest';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

const PostmanApi = ({ apis, env }) => {
    const [selectedApi, setSelectedApi] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApis = apis.filter(api => api.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ padding: 5, width: 350, overflowY: 'auto', borderRight: '1px solid #ddd' }}>
                <TextField label="Search API" variant="outlined" fullWidth style={{ marginBottom: 10 }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {filteredApis.map((api) => (
                    <button key={api.id} className='apiButton' onClick={() => setSelectedApi(api)}>{api.name}</button>
                ))}
                <Button variant="outlined" fullWidth onClick={() => { /* Handle Add New */ }}>Add New</Button>
                {/* <AddRequestForm /> */}
            </div>
            <div style={{ flexGrow: 1, padding: 20 }}>
                <ShowRequest selectedApi={selectedApi} />
            </div>

            <style jsx>{`
                .apiButton{ padding:10px 20px; width:100%; font-weight:bold; color:black; background:linear-gradient(#9b9b9b85, #ffffff85,#9b9b9b85); border-bottom:solid 1px rgb(104 104 104);  border:0;  font-size: 16px; cursor: pointer; }
                .apiButton:hover {
                    background-color: #f0f0f0;
                }
            `}</style>
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const url = `https://api.getpostman.com/collections/${process.env.collectionId}`;
    const environmentApiUrl = `https://api.getpostman.com/environments/${process.env.environmentId}`;
    const headers = { 'X-Api-Key': process.env.apiKey }

    const response = await fetch(url, { headers });
    const environmentApiResponse = await fetch(environmentApiUrl, { headers });

    const { collection } = await response.json();
    const { environment } = await environmentApiResponse.json();

    const env = environment?.values?.map((item) => ({ key: item.key || '', value: item.value || '' }));

    const apis = collection?.item?.map((item) => {
        let api = {
            id: item.id || '',
            name: item.name || '',
            description: item.description || '',
            request: item.request || '',
            fullReq: item.request?.url?.raw || '',
        }

        if (api.fullReq && api.fullReq.match(/\{\{(.+?)\}\}/)) {
            api.fullReq = api.fullReq.replace(/\{\{(.+?)\}\}/g, (match, key) => {
                const value = env?.find((item) => item.key === key)?.value;
                return value ? value : match;
            });
        }
        return api;
    });

    return {
        props: {
            apis: apis || null,
            env: env || null
        },
    };
}

export default PostmanApi;