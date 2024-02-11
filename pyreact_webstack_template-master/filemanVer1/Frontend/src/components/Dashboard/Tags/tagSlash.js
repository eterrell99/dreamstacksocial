import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../Services/token_refresh";
import Post from "../Post/post"
import Navbar from "../../Site/Navbar/Navbar";
import TagsList from "../TagList";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
  } from "@material-ui/core";
export default function TagSlash() {
  const { eee } = useParams(); // Specify the type of ee as string
  const [tagPosts, setTagPosts] = useState();
    const [tagData,setTagData] = useState();
    const [expanded,setExpanded] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`posts/bytag/${eee}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
          
        });
        setTagPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    };
    fetchPosts();
  }, [eee]);
  
  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await api.get(`tag/${eee}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
          
        });
        setTagData(response.data);
        
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    };
    fetchTag();
  }, [eee]);
  



  return (
    <div>

        <Navbar expanded={expanded} setExpanded={setExpanded} />
        <Card sx={{marginBottom:"20px"}}>
            <TagsList expanded={expanded}/>
        
              <CardContent>
                <Grid container spacing={4}> 
                    <Grid item>
                        <Typography variant="h6" component="div">
                  { tagData ? (tagData[0].name) : ("")}
                        </Typography>
                </Grid>
                    <Grid item>
                        <Typography variant="body2" color="textSecondary">
                            Post Count: {tagData ? (tagData[0].post_count):("")}
                        </Typography>
                    </Grid>
                    <Grid item>
                    <Typography variant="body2" color="textSecondary">
                  Total Comments Count: {tagData ? (tagData[0].comment_count):("")}
                    </Typography>
                    </Grid>
                    
                </Grid>
                
                
              </CardContent>
            </Card>
            <Grid container>
                <Grid item>
                    <Button>Likes</Button>
                </Grid>
                <Grid item>
                    <Button>Comments</Button>
                </Grid>
            </Grid>
        { tagPosts? (<div>
            {tagPosts.map((post,i)=> (<Post post={post} thread={false}/>))}
        </div>):(<div></div>)}
 </div>
  );
}
