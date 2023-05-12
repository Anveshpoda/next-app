import React from 'react'
import logo from '../public/logo.svg'
import Image from 'next/image'
import SearchBar from './UI/searchBar'
import { Avatar } from '@mui/material'
import pImg from '../images/JD.jpg'


const Header = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div><Image src={logo} style={{ animation: 'App-logo-spin infinite 20s linear' }} width={80} className="applogo" alt="logo" /></div>

            <div style={{ padding: 5, width: '100%' }}> <SearchBar /></div>

            <div style={{ margin: '8px 18px', justifyContent: "end", display: "flex" }}>
                <Avatar style={{width:45, height:45}}>
                    <Image src={pImg} alt={"Anv"} layout="fill" />
                </Avatar>
            </div>

        </div>
    )
}

export default Header