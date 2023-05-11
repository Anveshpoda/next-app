import Cgrid from '@/components/UI/muiGrid2'
import { Container } from '@mui/material'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react'
import logo from '../public/logo.svg'
import Image from 'next/image';
import DashboardStyles, { imgStyle } from '@/styles/dashboard';
import { PrismaClient } from '@prisma/client'
import Header from '@/components/header';
import Atom from '@/components/UI/atom';
import { createApi } from 'unsplash-js';
import SearchBar from '@/components/UI/searchBar';


const Dashboard = () => {
    const [bgI, setBackground] = useState('')


    useEffect(()=>{
        const unsplash = createApi({
            accessKey: 'uwzK1c6P03jOwNxFaynmjcNOg54jZ6R8coN83OxYkaM',
            // `fetch` options to be sent with every request
            // headers: { 'X-Custom-Header': 'foo' },
        });

        // unsplash.photos.get(
        //     { photoId: '123' },
        //     // `fetch` options to be sent only with _this_ request
        //     { headers: { 'X-Custom-Header-2': 'bar' } },
        // );

        unsplash.photos.get({ photoId: '_RBcxo9AU-U' }).then(result => {
            switch (result.type) {
              case 'error':
                console.log('error occurred: ', result.errors[0]);
              case 'success':
                const photo = result.response;
                setBackground(photo.urls.full)
                console.log(photo);
            }
          });
    },[])

    return (
        <div>
            <Header />
            <div style={{ height: 500 }}>

                <div className='divCenter'>
                    <div style={{ padding: '50px', backgroundColor: '#efecec80', borderRadius: 10 }}>

                        <div style={{ display: 'flex', marginBottom: 70 }}>
                            <div style={{ margin: 'auto' }}><Atom /></div>
                        </div>
                        {/* <img src={logo} className="App-logo" alt="logo" /> */}
                        <SearchBar/>

                    </div>
                </div>

                <style jsx global>{`
                    #__next{
                        background: url(${bgI});
                        background-size: cover;
                    }
                `}</style>
                <style jsx>{DashboardStyles}</style>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    // const prisma = new PrismaClient()

    // try {
    //     const user = await prisma.user.create({
    //         data: {
    //             name: 'Anvesh',
    //             email: 'podaanvesh@gmail.com',
    //             mobile: "9492243961"
    //         },
    //     })
    //     console.log(user)
    // } catch (e) {
    //     console.log('e >> ', e)
    // }

    return {
        props: {

        }
    }
}

export default Dashboard