import React, { useEffect, useState,useRef } from "react";
import Navbar  from "../Site/Navbar/Navbar";
import getUser from "./getUser";
import Post from "./Post/post";
import api from "../Services/token_refresh";
import TagsList from "./TagList";

import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  IconButton,
  Collapse,
  makeStyles,
} from "@material-ui/core";
import TextField from '@mui/material/TextField';
import Grid from "@material-ui/core/Grid";
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Dash() {

    const email = localStorage.getItem("email");
    const access = localStorage.getItem("access");
    const [topPosts, setTopPosts] = useState();
    const [topTags, setTopTags] = useState();
    const [expanded, setExpanded] = useState(false);
    const [createPostExpanded, setCreatePostExpanded] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);    
    const fileInputRef = useRef(null);
    const [postText, setPostText] = useState();
    const [titleText, setTitleText] = useState();
    const [formData, setFormData]= useState({});



    // 
    // Submit requset
    //
     
    const handleSubmitPost = async (e) => {
      e.preventDefault();
    
      if (postText && titleText) {
        try {
          // Step 1: Create the post and get the post ID
          const postResponse = await api.post(
            'post/create/',
            { title: titleText, text: postText, files: {...selectedFiles} },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'filename':   selectedFiles[0],
                Authorization: `Bearer ${localStorage.getItem('access')}`,
              },
            }
          );
    
          const postId = postResponse.data.id;
    
          // Step 2: Upload files associated with the post
          for (const file of selectedFiles) {
            const fileFormData = new FormData();
            fileFormData.append('file', file);
    
            // Step 3: Append the post ID to the FormData
            fileFormData.append('post', postId);
    
            // Step 4: Send a separate request for each file
            await api.post('files/', fileFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('access')}`,
              },
            });
          }
    
          console.log('Post and files uploaded successfully!');
        } catch (error) {
          console.error('Error creating post and uploading files:', error);
        }
      }
    };
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...files]);
      console.log(files);
    };
  
    const openFileExplorer = () => {
      
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
    const discardNewPost = (e) => {
      e.preventDefault();
      setCreatePostExpanded(false);
    }
    const handleRemoveFile = (e, fileToRemove) => {
      e.preventDefault();
      const updatedFiles = selectedFiles.filter((file) => file !== fileToRemove);
      setSelectedFiles(updatedFiles);
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleExpandNewPost = () => {
      setCreatePostExpanded(!createPostExpanded);
    };

    useEffect(()=> {
    const fetchTopPosts = async () => {
      try {
        const response = await api.get(`post/top/`,{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
        setTopPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Rethrow the error for handling in the component
      }
    };
    fetchTopPosts();  }, [])

    useEffect(()=> {
      const fetchTopTags = async () => {
        try {
          const response = await api.get(`tag/top/`);
          setTopTags(response.data);
        } catch (error) {
          console.error("Error fetching posts:", error);
          throw error; // Rethrow the error for handling in the component
        }
      };
      fetchTopTags();  }, [])
    const { userData, loading, error } = getUser(email, access);
    if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }
      



      //files
  
    return (
      <div>
        <Navbar />
      <div style={{ display: "flex" }}>
        
        {/* Render the TagsList component */}
        
        <TagsList tags={topTags} expanded={expanded}/>
        
        <div style={{ flex: 1, paddingLeft: '25px',paddingRight:'25px',marginLeft: expanded ? "200px" : "0" }}>
          
          <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "Collapse Tags" : "Expand Tags"}
      </button> <h2>Welcome {userData.first_name}</h2>
      <Button onClick={handleExpandNewPost}>New Post</Button>
      <Collapse in={createPostExpanded} timeout="auto" unmountOnExit>
      <TextField
            fullWidth
          id="outlined-multiline-static"
          label="Title"
          multiline
          rows={1}
          defaultValue=""
          onChange={(e)=>setTitleText(e.target.value)}
          sx={{padding:'10px'}}
        />
            <TextField
            fullWidth
          id="outlined-multiline-static"
          label="New Post"
          multiline
          rows={4}
          defaultValue=""
          onChange={(e)=>setPostText(e.target.value)}
          sx={{padding:'10px', witdh:'90vw'}}
        />
        <div style={{padding:'10px'}}>
        <Grid container direction="row" justifyContent="center" alignItems="center">
        <Grid item><Button variant={"outlined"} startIcon={<DeleteIcon/>} onClick={(e)=> discardNewPost(e)}>Discard</Button>
        </Grid>
        <Grid item>
        <input
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
        ref={fileInputRef}
      />
       
      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineIcon/>}
        onClick={openFileExplorer}
      >
        Attach
      </Button></Grid>
      
      <Grid item>
      {selectedFiles.length > 0 ? (<div> 
        <Button
        variant="contained"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Files {selectedFiles.length}
      </Button>
        <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {selectedFiles.map((file, i) => (
                  <MenuItem
                    key={`file${i}`}
                    onClick={(e) => handleRemoveFile(e, file)}
                  >
                    {file.name}
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                  </MenuItem>
                ))}
        
      </Menu>

      </div>): (<div></div>)}
      </Grid>
        <Grid item>
          <Button variant={'contained'} startIcon={<ReplyIcon/>} onClick={(e)=>handleSubmitPost(e)}>Submit</Button>
        </Grid>
        </Grid>
        </div>
            </Collapse>
          
          {topPosts ? (
            topPosts.map((post) => <Post key={post.id} post={post} thread={false}/>)
          ) : (
            <div></div>
          )}
        </div>
      </div>
      </div>
    );


}