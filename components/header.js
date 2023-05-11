import React from 'react'
import logo from '../public/logo.svg'
import Image from 'next/image'
import SearchBar from './UI/searchBar'


const Header = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div><Image src={logo} style={{ animation: 'App-logo-spin infinite 20s linear' }} width={80} className="applogo" alt="logo" /></div>

            <div style={{padding:5}}>
                <SearchBar/>
            </div>
            


        </div>
    )
}

export default Header