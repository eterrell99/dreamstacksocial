import React, { useEffect, useState,useRef } from "react";
import Navbar  from "../Site/Navbar/Navbar";
import getUser from "../Dashboard/getUser";
import api from "../Services/token_refresh";
import TagsList from "../Dashboard/TagList";
import TagSearch from "../Dashboard/tagSearch";
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
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TagDash from '../Dashboard/Tags/tagDash'
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from "react-router";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams } from "react-router-dom";
export default function SUser() {
    const { uid } = useParams();
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const access = localStorage.getItem("access");
    const { userData, loading, error } = getUser(email, access);
    const [topPosts, setTopPosts] = useState();
    const [topTags, setTopTags] = useState();
    const [expanded, setExpanded] = useState(false);
    const [createPostExpanded, setCreatePostExpanded] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);    
    const fileInputRef = useRef(null);
    const [postText, setPostText] = useState();
    const [titleText, setTitleText] = useState();
    const [formData, setFormData]= useState({});
    const [selectedTags, setSelectedTags] = useState();
    const [showTopTag, setShowTopTag] = useState(false);
    const [tagParent, setTagParent] = useState();
    const matches = useMediaQuery('(min-width:600px)'); 
    const [uData, setUData] = useState();
    // Submit requset
    //  
    
    useEffect(() => {
        const fetchSUser = async () => {
          try {
            const response = await api.get(`user/${uid}/`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
              
            });
            setUData(response.data);
          } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
          }
        };
        fetchSUser();
      }, [uid]);

     
    const handleSubmitPost = async (e) => {
      e.preventDefault();
    
      if (postText && titleText) {
        try {
          // Step 1: Create the post and get the post ID
          const postFormData = new FormData();
          postFormData.append('title', titleText);
          postFormData.append('text', postText);
          console.log(selectedTags);
          postFormData.append('tags',JSON.stringify(selectedTags))
          const postResponse = await api.post('post/create/', postFormData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
          });
    
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

    const handleSelectTopTags = () => {
      setShowTopTag(!showTopTag);
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
    
    if (loading) {
        console.log('loding')
      }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }
      



      //files
  
    return (
      <div>
        <Navbar expanded={expanded} setExpanded={setExpanded} setCreatePostExpanded={setCreatePostExpanded}/>
      <div style={{ display: "flex" }}>
        
        {/* Render the TagsList component */}
        
        <TagsList expanded={expanded} setExpanded={setExpanded} tag={tagParent} setTags={setTagParent}/>
        
        <div style={{ flex: 1, paddingLeft: '25px',paddingRight:'25px', marginTop:'67px' }}>
          <Grid container 
            direction="row"
            justifyContent="center"
            alignItems="center">
                <Grid item>
                <Button onClick={handleExpandNewPost} startIcon={<AddCircleOutlineIcon/>}>New Post</Button>
                </Grid>


          </Grid>
            
            
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
              <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
                <Grid item>
                  <TagSearch tags={topTags} hoistTags={setSelectedTags}/>
                </Grid>
                <Grid item>
                  <Button variant={"outlined"} startIcon={<DeleteIcon/>} onClick={(e)=> discardNewPost(e)}>Discard</Button>
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
                  </Button>
                </Grid>
            
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
        <Typography>{uData ? uData.username: ''}</Typography>
        </div>
      </div>
      </div>
    );


}