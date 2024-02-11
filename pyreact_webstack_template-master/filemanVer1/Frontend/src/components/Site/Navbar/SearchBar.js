import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import api from '../../Services/token_refresh';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ListItemButton from '@mui/material/ListItemButton';
import { Person } from '@mui/icons-material';



export default function SearchBar() {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [expanded, setExpanded] = useState(false);

    const handleSearchQuery = async (e) => {
        e.preventDefault();
        setSearch(e.target.value);

        if (e.target.value.length !== 0) {
            try {
                const response = await api.get('search/', {
                    params: { search: e.target.value },
                    headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
                });
                setSearchResults(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error creating comment:", error);
            }
        }
    };

    const handleOpenUser = () => {
        setExpanded(!expanded);
    };
    const getUniqueUsers = () => {
        const uniqueUsers = new Map();
    
        if (searchResults && searchResults['users']) {
            // Check if 'users' property exists and is an array
            if (Array.isArray(searchResults['users']['username'])) {
                searchResults['users']['username'].forEach((user) => {
                    // Check if 'username' property exists
                    if (user.username) {
                        uniqueUsers.set(user.id, user);
                    }
                });
            }
        }
    
        
    
        // Convert the map values back to an array
        
        return Array.from(uniqueUsers.values());
    };
    const getUniquePosts = () => {
        const uniquePosts = new Map();
    
        if (searchResults && searchResults['posts']) {
            // Check if 'users' property exists and is an array
            if (Array.isArray(searchResults['posts']['title'])) {
                searchResults['posts']['title'].forEach((post) => {
                    // Check if 'username' property exists
                    if (post.title) {
                        uniquePosts.set(post.id, post);
                    }
                });
            }
        }
    
        
    
        // Convert the map values back to an array
        
        return Array.from(uniquePosts.values());
    };



    return (
        <div>
            <List
                direction="column"
                sx={{
                    width: '400px',
                    position: 'relative',
                    backgroundColor: 'white',
                }}
            >
                <ListItem alignItems="flex-start">
                    <InputBase
                        sx={{ ml: 1, flex: 1, maxHeight: '25px', minWidth: '300px',maxWidth:'600px', }}
                        placeholder="Search"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={(e) => handleSearchQuery(e)}
                    />
                    <ListItemIcon>
                        <SearchIcon />
                    </ListItemIcon>
                </ListItem>
                <Collapse
                    in={search.length !== 0}
                    timeout="auto"
                    unmountOnExit
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        zIndex: 1,
                        width: '100%',
                        backgroundColor: 'white',
                        color: 'black',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        border: '1px solid #000000',
                    }}
                >
                     <div>
                        {searchResults.length === 0 ? (
                            <></>
                        ) : (
                            <div>
                                <ListItemButton onClick={handleOpenUser}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`Users ${getUniqueUsers().length}`} />
                                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItemButton>
                                <ListItemButton onClick={handleOpenUser}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`Users ${getUniquePosts().length}`} />
                                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItemButton>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {getUniqueUsers().map((user, index) => (
                                            <ListItemButton key={index} sx={{ pl: 4 }}>
                                                <ListItemIcon>
                                                    <PersonIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                                            </ListItemButton>
                                        ))}
                                        
                                    </List>
                                </Collapse>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                {getUniquePosts().map((post, index) => (
                                            <ListItemButton key={index} sx={{ pl: 4 }}>
                                                <ListItemIcon>
                                                    <PersonIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`${post.title}`} />
                                            </ListItemButton>
                                        ))}
                                </Collapse>
                            </div>
                        )}
                    </div>
                </Collapse>
            </List>
        </div>
    );
}