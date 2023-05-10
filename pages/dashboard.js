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


const Dashboard = () => {
    const [search, setSearch] = useState('')

    const gSearch = () => {
        console.log('search >> ', search)
        search && (window.location.href = `https://www.google.com/search?q=${search}`)
    }

    const imgStyle = { animation: 'App-logo-spin infinite 20s linear', margin: 'auto' };


    return (
        <div>
            <Header/>
            <div style={{ height: 500 }}>
                <div className='divCenter'>
                    <div style={{ justifyContent: 'center' }}>

                        <div style={{ display: 'flex', marginBottom: 20 }}>
                            <Image src={logo} style={{ ...imgStyle }} width={200} className="applogo" alt="logo" />
                            <div className='child'><main>
                                <div className="atom">
                                    <div className="electron"></div>
                                    <div className="electron-alpha"></div>
                                    <div className="electron-omega"></div>
                                </div>
                            </main></div>
                        </div>
                        {/* <img src={logo} className="App-logo" alt="logo" /> */}
                        <Paper component="form" onSubmit={(e, n) => { e.preventDefault(); gSearch() }} sx={{ p: '2px 6px', display: 'flex', alignItems: 'center', width: 450, borderRadius: 10 }}>
                            <InputBase sx={{ ml: 1, flex: 1 }}
                                placeholder="Search Google"
                                inputProps={{ 'aria-label': 'search google maps' }}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>

                    </div>
                </div>


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