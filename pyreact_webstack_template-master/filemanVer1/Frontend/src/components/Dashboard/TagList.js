import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Paper,
  List,
  Avatar,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MessageIcon from '@mui/icons-material/Message';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import api from '../Services/token_refresh'
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import { setSaveList } from "../Redux/saveBarSlice";
import { useSelector, useDispatch } from 'react-redux'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
const TagsList = ({ expanded, tags, setTags }) => {
  let test = useSelector(state => state.save.saveList);
  let userTest = useSelector(state => state.save.saveList);
  
  const matches = useMediaQuery('(min-width:600px)');
  const dispatch = useDispatch();
  const useStyles = makeStyles((theme) => ({
    root: {
      position: "fixed",
      top: !matches ? 55: 64,
      left: 0,
      width: "200px", // Width when expanded
      height: "100%", // Make it cover the entire height
      backgroundColor: "#f5f5f5",
      overflowY: "auto",
      boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", // Add shadow to separate from content
      transition: "left 0.3s ease", // Smooth transition for left property
      zIndex:1,
      borderTopLeftRadius:'0px',
    },
    collapsed: {
      left: "-200px", // Move it to the left when collapsed
    },
  }));
  
  const classes = useStyles();
  const navigate = useNavigate();
  const [svTags, setSvTags] = useState();
  const [userSaveExpand,setUserSaveExpand] = useState(false);
  const [postSaveExpand,setPostSaveExpand] = useState(false);
  const [userSaves, setUserSaves] = useState([]);
  const handlePostSaveExpand = () => {
    setPostSaveExpand(!postSaveExpand);
  };
  const [tagSaveExpand,setTagSaveExpand] = useState(false);

  const handleTagtSaveExpand = () => {
    setTagSaveExpand(!tagSaveExpand);
  };

  const handleTagClick = (e,tag) => {
    e.preventDefault();
    navigate(`/post/${tag.post.id}/`)
  }
  

    useEffect(()=> {
      const fetchUserSaves = async () => {
      try {
        const response = await api.get(`user/save/`, {headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      });
      setUserSaves(response.data);
      
        
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Rethrow the error for handling in the component
      }
    };
    fetchUserSaves();  }, [test])

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
      fetchTopTags();  }, [test])  

      const handleUserSaveExpand = () => {
        setUserSaveExpand(!userSaveExpand);
      };




      
  return (
    <Paper
      className={`${classes.root} ${expanded ? "" : classes.collapsed}`}
      elevation={3}
    >
      <List>
        <ListItemButton onClick={handlePostSaveExpand}>
          <ListItemIcon> 
            <MessageIcon/>
          </ListItemIcon>
          <ListItemText primary={`Posts - ${svTags? svTags.length: ''} `}/>
        </ListItemButton>
        <Collapse in={postSaveExpand}>
        {svTags?(svTags.map((tag) => (
          <div key={`div${tag.id}`}>
          <ListItem button key={`listitme${tag.id}`}>
            <ListItemAvatar>
              <Avatar key={`avatarr${tag.id}`} className={classes.avatar} src={tag.post.user.profile_pic ? (tag.post.user.profile_pic):("")}>{tag.post.user.profile_pic ? "":  tag.post.user.first_name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText key={`itemtext${tag.id}`} primary={tag.post.title} onClick={(e)=> handleTagClick(e,tag)}/>
          </ListItem>
          <Divider variant="middle" component="li" key={`divider${tag.id}`}/>
          </div>
        ))):(<div></div>)}
        </Collapse>
        <ListItemButton onClick={handleUserSaveExpand}>
          <ListItemIcon> 
            <AccountCircleOutlinedIcon/>
          </ListItemIcon>
          <ListItemText primary={`Users - ${userSaves ? userSaves.length : ''}`} />
        </ListItemButton>
        <Divider variant="middle" component="li"/>
        {/* Render your tags here */}
        <Collapse in={userSaveExpand}>
        {userSaves?(userSaves.map((user) => (
          <div key={`div${user.id}`}>
          <ListItem button key={`listitme${user.id}`}>
            <ListItemAvatar>
              <Avatar key={`avatarr${user.id}`} className={classes.avatar} src={user.user_saved.profile_pic ? (user.user_saved.profile_pic):("")}>{user.user_saved.profile_pic ? "":  user.user_saved.first_name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText key={`itemtext${user.id}`} primary={user.user_saved.first_name} onClick={(e)=> handleTagClick(e,tag)}/>
          </ListItem>
          <Divider variant="middle" component="li" key={`divider${user.id}`}/>
          </div>
        ))):(<div></div>)}
        </Collapse>
        
      </List>
      
    </Paper>
  );
};

export default TagsList;