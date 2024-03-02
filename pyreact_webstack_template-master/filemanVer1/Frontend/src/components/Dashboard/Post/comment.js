import React, { useState } from "react";
import { Card, CardContent, Typography, IconButton, makeStyles } from "@material-ui/core";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import api from "../../Services/token_refresh";
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Avatar from "@mui/material/Avatar";
import { Button } from "@mui/material";
import Collapse from "@mui/material/Collapse";

import TextField from '@mui/material/TextField';
import ReplyIcon from '@mui/icons-material/Reply';
import CreateIcon from '@mui/icons-material/Create';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Comment = ({ comment,onDeleteComment,postID,setNewComment }) => {
  const [likeCountState, setLikeCountState] = useState(comment.like_count);
  const [hasLiked, setHasLiked] = useState(comment.user_has_liked);
  const [expanded, setExpanded] = useState(false);

  const [commentPostText, setCommentPostText] = useState();
  const [postCommentExpanded, setPostCommentExpanded] = useState(false);
  const [replies, setReplies] = useState(comment.replies)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };
  const useStyles = makeStyles((theme) => ({
    
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
  const classes = useStyles();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleSubmitComment = (e) => {
    e.preventDefault()
      if (commentPostText) {
          try {
             const addComment = async () => {

                  const response = await api.post('comment/',{parent_post: postID, parent_comment: comment.id,CommentText: commentPostText,is_reply:true},{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}})
                  setNewComment({});
                  setReplies({});
                  setReplies((prev)=>comment.replies);
                }
             addComment();
            } catch (error) {
              console.error("Error creating comment:", error);
           }
          }; 

      };
      const discardComment = (e) => {
        e.preventDefault();
        setCommentPostText('');
        setPostCommentExpanded(false);
      }
        
  const handleLikeClick = () => {
    if (hasLiked === false) {
        const addLike = async () => {
            try {
              const response = await api.post(`comment/${comment.id}/like/`, {comment:comment.id},{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
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
        const response = await api.delete(`comment/${comment.id}/like/`,{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
        setHasLiked(false);
        setLikeCountState((prev)=> prev-1);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Rethrow the error for handling in the component
      }
    }; removeLike();
    }
  };
  const handlePostCommentClick = () => {
    setPostCommentExpanded(!postCommentExpanded);
  };
  const handleDeleteComment = (e) => {
    e.preventDefault()
    const deleteComment = async () => {
        try {
          const response = await api.delete(`comment/${comment.id}/`, {params:{id:comment.id}},{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}});
          onDeleteComment(comment.id);
          setReplies((prevReplies) => prevReplies.filter((reply) => reply.id !== commentId));  
          
        } catch (error) {
          console.error("Error fetching posts:", error);
          throw error; // Rethrow the error for handling in the component
        }
      }; deleteComment();
  };
  
  const handleDeleteReply = (commentId) => {
    // Remove the comment with the specified commentId from topComments
    const updatedReplies = replies.filter((reply) => reply.id !== commentId);
    
    // Update the state with the new array
    setReplies(updatedReplies);
  };

  const renderNestedComments = (replies) => {
    return replies.map((reply) => (
      <Comment
        key={reply.id}
        comment={reply}
        onDeleteComment={handleDeleteReply} // Pass a callback to delete replies
        postID={postID}
        setNewComment={setNewComment}
      />
    ));
  };
  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
            <Avatar src={comment.user.profile_pic}>{comment.user.profile_pic ? "": comment.user.first_name.charAt(0)}</Avatar>
            </Grid>
            <Grid item>
            <Typography variant="subtitle2" >
               {comment.user.first_name} {comment.user.last_name} on {formatDate(comment.created)}
          </Typography>
            </Grid>
            <Grid item> { comment.user.email === localStorage.getItem('email') ? (<Button startIcon={<DeleteIcon/>} onClick={(e)=>handleDeleteComment(e)}>Delete</Button> ) : (<div></div>)   }
        </Grid>
        </Grid>
       

        <Typography variant="body1">{comment.CommentText}</Typography>
        {/* Like button */}
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
            {comment.comment_count} Comments
            {comment.comment_count > 0 ? (<IconButton
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
        <Button variant={"outlined"} startIcon={<DeleteIcon/>} onClick={(e)=> discardComment(e)}>Discard</Button>
        <Button variant={'contained'} startIcon={<ReplyIcon/>} onClick={(e)=>handleSubmitComment(e)}>Submit</Button>
            </Collapse>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {replies && renderNestedComments(replies)}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default Comment;