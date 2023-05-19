import AddRequestForm from '@/components/postman/addRequest';
import ShowRequest from '@/components/postman/showRequest';
import { Button } from '@mui/material';
import { useState } from 'react';


const PostmanApi = ({ apis, env }) => {
    const [selectedApi, setSelectedApi] = useState(null);

    return (
        <div>

            <div style={{ display: 'flex' }}>
                <div style={{ padding: 5, width: 350, overflowY: 'hidden', height: '100%' }}>
                    {/* <h1>API List</h1> */}

                    {apis?.map((api) => (
                        <button key={api.id} className='apiButton' style={{}} onClick={() => setSelectedApi(api)}>{api.name}</button>
                    ))}
                    <button className='apiButton' style={{}} onClick={() => { }}>Add New</button><br />
                    <Button variant="outlined" > Add New </Button>

                    {/* <AddRequestForm /> */}
                </div>
                <ShowRequest selectedApi={selectedApi}/>
            </div>
            <style jsx>{`
                .apiButton{
                    padding:10px 20px; width:100%; font-weight:bold; color:black; background:linear-gradient(#9b9b9b85, #ffffff85,#9b9b9b85);  
                    border-bottom:solid 1px rgb(104 104 104); border:0; font-size: 16px;
                }
            `}</style>
        </div>
    );
}


export const getServerSideProps = async (ctx) => {

    const url = `https://api.getpostman.com/collections/${process.env.collectionId}`;
    const environmentApiUrl = `https://api.getpostman.com/environments/${process.env.environmentId}`;
    const headers = { 'X-Api-Key': process.env.apiKey }

    // console.log('collectionId >> ',url)

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