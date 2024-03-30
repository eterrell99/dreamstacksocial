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
  CardHeader,
} from "@material-ui/core";
import InventoryIcon from '@mui/icons-material/Inventory';
import TextField from '@mui/material/TextField';
import Grid from "@material-ui/core/Grid";
import NotesIcon from '@mui/icons-material/Notes';
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
import FavoriteIcon from '@mui/icons-material/Favorite';
import ScheduleIcon from '@mui/icons-material/Schedule';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import UserSaved from "./userSave";
export default function SUser() {
  
  const { uid } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  useEffect(() => {
      const fetchData = async () => {
          try {
              if (uid) {
                  const response = await api.get(`/post/user/${uid}/`, {
                      headers: {
                          Authorization: `Bearer ${localStorage.getItem('access')}`,
                      },
                  });
                  setUserPosts(response.data);
                  console.log(`postsUser - ${uid} loaded`);
              } else {
                  console.error("User data or user ID is null or undefined.");
              }
          } catch (error) {
              console.error("Error fetching posts:", error);
              // Handle the error as needed
          }
      };

      fetchData();

  }, [uid]);

    const [postExpanded, setPostExpanded] = useState();
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
    const xsx = useMediaQuery('(min-width:600px)');
    const smx = useMediaQuery('(min-width:700px)');
    const mdx = useMediaQuery('(min-width:950px)');    
    const [uData, setUData] = useState();
    

    const handlePostExpaned = (e,postID) => {
      e.preventDefault();
      setPostExpanded(postID);
    };

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
      
      const handleFilter = (e,filterby) => {
        e.preventDefault();
        if (filterby === 'likes') {
          // Sort by likes
          const sortedPosts = [...userPosts].sort((a, b) => b.like_count - a.like_count);
          setUserPosts(sortedPosts);
        }
       else if (filterby === 'comments') { 
          //Sort by comment_count
          const sortedPosts = [...userPosts].sort((a, b) => b.comment_count - a.comment_count);
          setUserPosts(sortedPosts);
       }
        
        else if (filterby === 'date') {
          // Sort by date
          //from newest to oldest
          const sortedPosts = [...userPosts].sort((a, b) => new Date(b.created) - new Date(a.created));
          setUserPosts(sortedPosts);
        }
          
      else {
          console.error('Invalid filter type');
        }
      };


      const useStyles = makeStyles((theme) => ({
        root: {
          marginLeft: xsx ? '5%' : '2%',
          marginRight: xsx ? '5%' : '2%',
          
          background: 'linear-gradient(to right, #ffffff, #f3f3f3)',
        },
        bioCard: {
          height: '36vh',
          padding: '7px',
        },
        topPostsCard: {
          height: '36vh',
          padding: '7px',
        },
        avatarContainer: {
          
          justifyContent: 'center',
          alignItems: 'center',
        },
        userAvatar: {
          
          width: '150px',
          height: '150px',
          borderRadius: '0%',
          objectFit: 'cover',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          background: 'linear-gradient(to right, #ffffff, transparent)',
        },
        
      }));

  
      const classes = useStyles();

      //files
  
    return (
      <div >
        <Navbar expanded={expanded} setExpanded={setExpanded} setCreatePostExpanded={setCreatePostExpanded}/>
      <div style={{ display: "flex", }} >
        
        {/* Render the TagsList component */}
        
        <TagsList expanded={expanded} setExpanded={setExpanded} tag={tagParent} setTags={setTagParent}/>
        
        <div style={{ flex: 1, marginTop:'67px'}}>
          <Grid container 

            direction="row"
            justifyContent="center"
            alignItems="center">
                <Grid item>
                <Button onClick={handleExpandNewPost} startIcon={<AddCircleOutlineIcon/>}>New Post</Button>
                
                </Grid>
                <Grid item>
              <Button startIcon={<LocalOfferIcon/>}>Top Tags</Button>
              </Grid>
              <Grid item>
              <Button startIcon={<MessageIcon/>}>Top Posts</Button>
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
        <div className={classes.root}>
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
          {/* card 1  Profile Card*/}
          <Grid item xs={12} sm={8} md={6}>
            <Card >
              <Grid container direction="row" spacing={2}>
                <Grid item sx={4} md={4} lg={4} className={classes.avatarContainer}>
                  <Avatar className={classes.userAvatar} src={uData? uData.profile_pic: ''}></Avatar>
                </Grid>
              
                <Grid item xs={6} md={6} lg={6}>
                  <Grid container direction="row" justifyContent="center" alignItems="center">
                  <Grid item xs={3}>
                      <Button startIcon={<FavoriteIcon/>}>{uData? uData.total_like_count : "na"}</Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button startIcon={<MessageIcon/>}> {uData? uData.posts_count : "na"}</Button>
                    </Grid>
                    <Grid item xs={3}>
                    <Button startIcon={<NotesIcon/>}> {uData? uData.comments_count : "na"}</Button>
                    </Grid>
                    <Grid item xs={3}>
                    <UserSaved id={uData? uData.id : 0} />
                    </Grid>
                  </Grid>
                  <Typography>{uData ? uData.username: ''} - {uData ? uData.title: ''}</Typography>
                  <Typography>{uData ? uData.bio: ''}</Typography>
                  </Grid>

                </Grid>
            
            
            
           
            </Card>
                
            
          </Grid> 
          <Grid item xs={12} sm={4} md={6} >
            <Card>
              <Typography>Featured</Typography>
            </Card>
          </Grid>
          <Grid item>
          <Typography></Typography>  
          </Grid>
          <Grid item xs={12} sm={6} md={6} >
            <Card>
              <CardHeader title="Top Posts" action={<Grid container spacing={1}>
                <Grid item>
                  <Button onClick={(e)=>handleFilter(e,'likes')}><FavoriteIcon/></Button>
                  </Grid>
                  <Grid item>
                  <Button onClick={(e)=>handleFilter(e, 'comments')}><NotesIcon/></Button>
                  </Grid>
                  <Grid item>
                  <Button onClick={(e)=>handleFilter(e,'date')}><ScheduleIcon/></Button>
                  </Grid>
                 </Grid>} />
              <CardContent>
                <Grid container direction="column" spacing={1}> 
                {userPosts ? userPosts.map((post) => (
                  <Grid item xs={12} key={post.id}>
                    <Card>
                    <CardHeader 
                    title={post.title}
                     subheader={formatDate(post.created)}
                     action={
                      <Grid container spacing={1}>
                        <Grid item>  
                          <Button startIcon={<FavoriteIcon/>}>{post.like_count}</Button>
                        </Grid>
                        <Grid item> 
                          <Button startIcon={<NotesIcon/>}>{post.comment_count}</Button>
                        </Grid>
                      
                        <Grid item>
                          <Button onClick={(e)=>handlePostExpaned(e, postExpanded !== post.id ? post.id : null)} 
                              startIcon={postExpanded !== post.id ? <KeyboardArrowDownOutlinedIcon/> : <KeyboardArrowUpOutlinedIcon/>}
                          />
                        </Grid>

                      </Grid>
                      
                      }>

                      </CardHeader>
                      
                      <Collapse in={postExpanded === post.id} timeout="auto" unmountOnExit>
                      <CardContent>
                        <Typography>{post.text}</Typography>  </CardContent>

                        </Collapse>
                       
                     
                      
                      </Card>
                  </Grid>
                )) 
                : "Loading"}
                </Grid>
                
              </CardContent>
              
            </Card>
            
          </Grid>
          <Grid item>
          <Typography></Typography>  
          </Grid>
          </Grid>          

       
          </div>        
        

        </div>
      </div>
      </div>
    );


}







// Currently relying on fixed height for cards. If we want to have card heights that are dynamic, we will have to play with profile image sizing possibly aspect ration or abandon.