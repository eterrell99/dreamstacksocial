import React, {useEffect,useState} from "react";
import api from "../../Services/token_refresh";
import Post from "./post"
import Navbar from "../../Site/Navbar/Navbar";
import getUser from "../getUser";
import TagsList from "../TagList";
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
import { useParams } from "react-router-dom";

export default function ExpandedPost(){
    const param = useParams();
    const email = localStorage.getItem("email");
    const access = localStorage.getItem("access");
    const [postData, setPostData] = useState();
    const [topTags, setTopTags] = useState();
    const [expanded, setExpanded] = useState(false);

    useEffect(()=> {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`post/`,{headers:{Authorization:`Bearer ${localStorage.getItem('access')}`}, params:{id:param.post},});
        setPostData(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Rethrow the error for handling in the component
      }
    };
    fetchPosts();  }, [])

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
      


    return (
      <div>
        <Navbar />
      <div style={{ display: "flex" }}>
        
        {/* Render the TagsList component */}
        
        <TagsList tags={topTags} expanded={expanded}/>
        
        <div style={{ flex: 1, paddingLeft: '25px',marginLeft: expanded ? "200px" : "0" }}>
          
          <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "Collapse Tags" : "Expand Tags"}
      </button>
      

          {postData ? (<Post post={postData} thread={true}/>): (<div><h5>Error Loading Post</h5></div>)}
        </div>
      </div>
      </div>
    );


}