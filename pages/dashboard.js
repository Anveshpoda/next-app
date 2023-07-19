import React, { useEffect, useState } from 'react'
import DashboardStyles from '@/styles/dashboard';
import Header from '@/components/header';
import Cgrid from '@/components/UI/muiGrid2'
import { PrismaClient } from '@prisma/client'
import Atom from '@/components/UI/atom';
import { createApi } from 'unsplash-js';
import SearchBar from '@/components/UI/searchBar';


const Dashboard = () => {
    const [bgI, setBackground] = useState('https://source.unsplash.com/random/1900x1080/?nature&1')

    useEffect(() => {
        if ('undefined' != typeof (screen || window)) {
            const intervalId = setInterval(() => {
                setBackground('https://source.unsplash.com/random/' + (screen || window)?.width + 'x' + (screen || window)?.height + '?nature&' + Math.random(5))
                console.log(' >> ', bgI)
            }, 1000 * 60)
            // setBackground('https://source.unsplash.com/random/' + screen?.width + 'x' + screen?.height + '?nature')
            return () => clearInterval(intervalId)
        }

    }, [])


    useEffect(() => {
        const img = new Image();
        img.onload = () => { const body = document.querySelector('body'); body.style.backgroundImage = `url(${bgI})`; };
        img.src = bgI;
    }, [bgI]);

    return (
        <div>
            <Header />
            <div style={{ height: 500 }}>

                {/* <div className='divCenter'>
                    <div style={{ padding: '50px', backgroundColor: '#efecec80', borderRadius: 10 }}>

                        <div style={{ display: 'flex', marginBottom: 70 }}>
                            <div style={{ margin: 'auto' }}><Atom /></div>
                        </div>
                        <SearchBar />

                    </div>
                </div> */}

                {/* {console.log('screen.width >> ', screen.width)} */}

                <style jsx global>{`
                    body{ background: #322e3a url(${bgI}); background-size: cover }
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
    //             name: 'Viraj',
    //             email: 'viraj.joshi@gmail.com',
    //             mobile: "9637715436"
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