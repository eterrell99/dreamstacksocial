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
import { Height, Person } from '@mui/icons-material';
import MessageIcon from '@mui/icons-material/Message';
import {Avatar, Box, Grid} from "@material-ui/core";
import { AccountCircle } from "@mui/icons-material";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { purple,white } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function SearchBar() {
    const [searchButton, setSearchButton] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [postsExpanded, setPostsExpanded] = useState(false);
    const matches = useMediaQuery('(min-width:600px)');

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
    const handleOpenPost = () => {
        setPostsExpanded(!postsExpanded);
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

    const handleChangeSearchButton = (button) => {
        setSearchButton(!button);
    };

    const ColorButton = styled(Button)(({ theme }) => ({
        border:'none',
        minHeight:'42px',
        color: "#3c3c3c",
        backgroundColor: "#fafafa",
        '&:hover': {
          backgroundColor: "#dedede",
        },
      }));

    return (
        <div>
           <div style={{ display: 'flex', alignItems: 'center', width: !matches? '210px': '300px'}}>

           
           <ColorButton variant="contained"  onClick={()=>handleChangeSearchButton(searchButton)}>
                    <SearchIcon />
            </ColorButton >
            <Collapse in={searchButton} orientation="horizontal"> 

                <Paper
                        component="form"
                        sx={{display: 'flex', alignItems: 'center', width:'100%' }}
                    >
                <List  direction="column"
                                    sx={{
                                        width: '100%',
                                        position: 'relative',
                                        backgroundColor: 'white',
                                        border: '1px solid #979797' 
                                    }}> 
               
                    <InputBase
                        sx={{ ml: 1, flex: 1, maxHeight: '25px', width:'100%'}}
                        placeholder="Search"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={(e) => handleSearchQuery(e)}
                    />
            
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
                        maxHeight: '300px',
                        overflowY: 'auto',
                        border: '1px solid #818181',
                        
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
                                    <ListItemText primary={`Users - ${getUniqueUsers().length}`} />
                                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItemButton>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {getUniqueUsers().map((user, index) => (
                                            <ListItemButton key={index} sx={{ pl: 4 }}>
                                                <ListItemIcon>
                                                {user.profile_pic ? (<Avatar src={user.profile_pic}>{user.profile_pic ? "":  userData.first_name.charAt(0)}</Avatar>
                                                ):(<AccountCircle   fontSize="large"/>)}
                                                </ListItemIcon>
                                                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                                            </ListItemButton>
                                        ))}
                                        
                                    </List>
                                </Collapse>
                                <ListItemButton onClick={handleOpenPost}>
                                    <ListItemIcon>
                                        <MessageIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`Posts - ${getUniquePosts().length}`} />
                                    {postsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItemButton>
                                
                                <Collapse in={postsExpanded} timeout="auto" unmountOnExit>
                                {getUniquePosts().map((post, index) => (
                                            <ListItemButton key={index} sx={{ pl: 4 }}>
                                                <ListItemIcon>
                                                {post.user.profile_pic ? (<Avatar src={post.user.profile_pic}>{post.user.profile_pic ? "":  post.user.first_name.charAt(0)}</Avatar>
                                                ):(<MessageIcon  fontSize="large" />)}
                    
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
            </Paper>
            </Collapse>                     
        </div>
    </div>
    );
}