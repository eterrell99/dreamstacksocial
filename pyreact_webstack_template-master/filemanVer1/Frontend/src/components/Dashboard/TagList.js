import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Paper,
  List,
  Avatar,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { useNavigate } from "react-router";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import api from '../Services/token_refresh'
const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    top: 55,
    left: 0,
    width: "200px", // Width when expanded
    height: "100%", // Make it cover the entire height
    backgroundColor: "#f5f5f5",
    overflowY: "auto",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", // Add shadow to separate from content
    transition: "left 0.3s ease", // Smooth transition for left property
    zIndex:1,
  },
  collapsed: {
    left: "-200px", // Move it to the left when collapsed
  },
}));

const TagsList = ({ expanded, tags, setTags }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [svTags, setSvTags] = useState();

  const handleTagClick = (e,tag) => {
    e.preventDefault();
    navigate(`/post/${tag.post.id}/`)
  }

  useEffect(()=> {
    const fetchTopTags = async () => {
      try {
        const response = await api.get(`posts/usrsv/`, {headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      });
        setSvTags(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Rethrow the error for handling in the component
      }
    };
    fetchTopTags();  }, [tags])
  return (
    <Paper
      className={`${classes.root} ${expanded ? "" : classes.collapsed}`}
      elevation={3}
    >
      <List>
        {/* Render your tags here */}
        {svTags?(svTags.map((tag) => (
          <ListItem button key={tag.id}>
            <ListItemAvatar>
              <Avatar className={classes.avatar} src={tag.post.user.profile_pic ? (tag.post.user.profile_pic):("")}>{tag.post.user.profile_pic ? "":  tag.post.user.first_name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={tag.post.title} onClick={(e)=> handleTagClick(e,tag)}/>
          </ListItem>
        ))):(<div></div>)}
      </List>
      {/* Add a button or icon to toggle the expansion */}
      
    </Paper>
  );
};

export default TagsList;