
import { IconButton, InputBase, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react'

const SearchBar = () => {
    const [search, setSearch] = useState('')

    const gSearch = () => {
        console.log('search >> ', search)
        search && (window.location.href = `https://www.google.com/search?q=${search}`)
    }

    return (
        <Paper autoFocus component="form" onSubmit={(e, n) => { e.preventDefault(); gSearch() }} 
            sx={{ backgroundColor: '#ffffff8c', border: 'solid 1px #cdcdcd', p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: 550, width:`calc(100% - 8px)`, borderRadius: 10 }}>
            <InputBase sx={{ ml: 1, flex: 1 }}
                placeholder="Search Google"
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={e => setSearch(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    )
}

export default SearchBar