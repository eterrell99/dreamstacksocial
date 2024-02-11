import React, { useState, useEffect,useRef   } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Collapse,
  makeStyles,
  Button,
} from "@material-ui/core";
import ImageViewer from "./mediaViewer";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import api from "../../Services/token_refresh";
import Comment from "./comment";
import Grid from "@material-ui/core/Grid";
import CreateIcon from '@mui/icons-material/Create';
import TextField from '@mui/material/TextField';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add } from "@mui/icons-material";
import ListItemIcon from '@mui/material/ListItemIcon';
import TestTag from "./testTag";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PostSaved from "./userPostSave";
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (timestamp) => {

  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const Post = ({ post, thread }) => {

  const useStyles = makeStyles((theme) => ({
    cardContainer: {
      display: thread ? "flex" : '',
      justifyContent: thread ? "center" :'', // Center horizontally
      paddingBottom: '7px',
      
    },
    card: {
      maxWidth: thread ? "78vw" : "60vw", // Adjust the maxWidth
      padding: thread ? "0 75px" : "0", // Apply padding only if it's a thread
      width: thread ? "78vw" : "auto",
    
    },
    content: {
      paddingBottom: "8px",
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    timestamp: {
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
    },
    tags: {
      marginTop: "8px",
    },
  }));

  const {
    id,
    like_count,
    comment_count,
    user,
    title,
    text,
    created,
    tags,
    user_has_liked,
    files
  } = post;
  
  const [likeCountState, setLikeCountState] = useState(like_count);
  const [hasLiked, setHasLiked] =useState(user_has_liked);
  const [expanded, setExpanded] = useState(false);
  const [postCommentExpanded, setPostCommentExpanded] = useState(false);
  const classes = useStyles();
  const [topComments, setTopComments] = useState();
  const [newComment, setNewComment] = useState();
  const [commentPostText, setCommentPostText] = useState();
  const [postSaved, setPostSaved] = useState(post.user_has_saved);
  const navigate = useNavigate();
  const handleSubmitPostComment = (e) => {
    e.preventDefault()
      if (commentPostText) {
          try {
             const addComment = async () => {
                  const response = await api.post('comment/',{parent_post: id, CommentText: commentPostText},{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}})
                  setNewComment(response.data);
                  setPostCommentExpanded(false);
                }
             addComment();
            } catch (error) {
              console.error("Error creating comment:", error);
           }
          }; 

      };

  const tagClick = (e,tag) =>{ 

    e.preventDefault();
    navigate(`/ee/${tag.name}/`)
  }

  const handleLikeClick = () => {
    if (hasLiked===false){const addLike = async () => {
      try {
        const response = await api.post(`post/${id}/like/`, {post:id},{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
        setHasLiked(true);
        setLikeCountState((prev)=> prev+1);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Rethrow the error for handling in the component
      }
    }; addLike();
  } else {
    const removeLike = async () => {
      try {
        const response = await api.delete(`post/${id}/like/`,{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
        setHasLiked(false);
        setLikeCountState((prev)=> prev-1);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; 
      }
    }; removeLike();
    } 
    
  };


  const discardComment = (e) => {
    e.preventDefault();
    setCommentPostText('');
    setPostCommentExpanded(false);
    setSelectedFiles([]);
  }

  const handlePostCommentClick = () => {
    setPostCommentExpanded(!postCommentExpanded);
  };
  const handleDeleteComment = (commentId) => {
    // Remove the comment with the specified commentId from topComments
    const updatedComments = topComments.filter((comment) => comment.id !== commentId);
    
    // Update the state with the new array
    setTopComments(updatedComments);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  useEffect(()=> {
    const fetchTopComments = async () => {
      try {
        const response = await api.get(`comment/top/`+ id +'', {headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
        setTopComments(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; 
      }
    };
    fetchTopComments();  }, [newComment]);

    //file List
    const [selectedFiles, setSelectedFiles] = useState([]);    
    const fileInputRef = useRef(null);
  
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      console.log(files)
      setSelectedFiles([...selectedFiles, files]);
    };
  
    const openFileExplorer = () => {
      
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleRemoveFile = (e,fileToRemove) => {
      e.preventDefault()
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

    

  return (
    <div className={classes.cardContainer}>
    <Card className={classes.card} variant="outlined">
      <CardContent className={classes.content}>
        <Grid container spacing={2} direction="row" justifyContent="space-between" alignItems="center" >
          <Grid item>
            <Avatar className={classes.avatar} src={user.profile_pic}>{user.profile_pic ? "":  user.first_name.charAt(0)}</Avatar>
            </Grid>
          <Grid item>
            <Typography variant="subtitle2" className={classes.timestamp}>
               {user.first_name} {user.last_name} on {formatDate(created)}
          </Typography>
          </Grid>
          <PostSaved id={id} saved={postSaved}/>
          <Grid item>
              {thread ? (<div></div>): (<Button variant={"contained"} onClick={() => navigate(`/post/${id}/`)} endIcon={<KeyboardDoubleArrowRightIcon/>}>See Thread</Button>)}
          </Grid>
          
        </Grid>  
        <Typography variant="h6">{title}</Typography>
        <TestTag postID={1}/>
        
        {files.length > 0 ? (<ImageViewer files={files} />) : <div></div> }
        <Typography variant="body1">{text}</Typography>
        {/* If more than 2-3 tags, store tags in a dropdown. ex: [sports] +3 more */}
        {tags.length > 0 && (
          <div className={classes.tags}>
            <Typography variant="subtitle2">Tags:</Typography>
            {tags.map((tag) => (
              <Button
                onClick={(e)=>tagClick(e,tag)}
                key={tag.id}
                variant="outlined"
                size="small"
                style={{ marginRight: "8px", marginBottom: "8px" }}
              >
                {tag.name}
              </Button>
            ))}
          </div>
        )}

        <div className={classes.actions}>
          <div>
              
            {hasLiked ? (
            <IconButton onClick={handleLikeClick}>
              <FavoriteIcon color="primary" />
            </IconButton> 
             ):(<IconButton onClick={handleLikeClick}>
                <FavoriteBorderIcon color="primary" />
              </IconButton>
                )}
            
            {likeCountState} Likes


          </div>
          <div>
          <IconButton
              onClick={handlePostCommentClick}
              aria-expanded={postCommentExpanded}
              aria-label="show more"
            >
              <CreateIcon/>
            </IconButton>      
            
          </div>

          <div>
            {comment_count} Comments
            {comment_count > 0 ? (<IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>) : (<div></div>)}
            
          </div>
        </div>
        
        <Collapse in={postCommentExpanded} timeout="auto" unmountOnExit>
          
            <TextField
            fullWidth
          id="outlined-multiline-static"
          label="Add Comment"
          multiline
          rows={4}
          defaultValue=""
          onChange={(e)=>setCommentPostText(e.target.value)}
        /> 
        <Grid container direction="row" justifyContent="center"
  alignItems="center">
        <Grid item><Button variant={"outlined"} startIcon={<DeleteIcon/>} onClick={(e)=> discardComment(e)}>Discard</Button>
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
        {selectedFiles.map((file, i)=> (<MenuItem key={'file'+i} onClick={(e)=> handleRemoveFile(e,file)}>{file[0].name}<ListItemIcon><DeleteIcon/></ListItemIcon></MenuItem>
        ))}
        
      </Menu>

      </div>): (<div></div>)}
      </Grid>
        <Grid item>
          <Button variant={'contained'} startIcon={<ReplyIcon/>} onClick={(e)=>handleSubmitPostComment(e)}>Submit</Button>
        </Grid>
        </Grid> </Collapse>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {topComments ? (
  topComments.map((comment) => (
    <Comment key={comment.id} comment={comment} setNewComment={setNewComment} postID={id} onDeleteComment={handleDeleteComment}/> 
  ))
) : (
  <div></div>
)}
        </Collapse>
        
      </CardContent>
    </Card>
    </div>
  );
};

export default Post;