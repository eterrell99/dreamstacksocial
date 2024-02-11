import React, { useEffect, useState } from "react";
import Navbar from "../../Site/Navbar/Navbar";
import api from "../../Services/token_refresh";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  makeStyles,
  Button
} from "@material-ui/core";
import { useNavigate } from "react-router";
const useStyles = makeStyles({
  card: {
    marginBottom: 16,
  },
});

export default function TagDash() {
  const email = localStorage.getItem("email");
  const access = localStorage.getItem("access");
  const [topTags, setTopTags] = useState([]);
    const navigate = useNavigate();
  useEffect(() => {
    const fetchTopTags = async () => {
      try {
        const response = await api.get(`tag/top/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        setTopTags(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Rethrow the error for handling in the component
      }
    };
    fetchTopTags();
  }, []);

  const classes = useStyles();

  const handleSeeMore = (e,name) => {
    e.preventDefault();
    navigate(`/ee/${name}/`);
  }

  return (
    <div>
      <div style={{ padding: "30px",marginTop:'20px' }}>
        <Grid container direction="column" justifyContent="center">
          {topTags.map((tag) => (
            <Card key={tag.id} className={classes.card}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {tag.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Post Count: {tag.post_count}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Comments Count: {tag.comment_count}
                </Typography>
                {topTags ? (<Button onClick={(e)=> handleSeeMore(e,tag.name)}>See Tag</Button>) : (<div></div>)}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </div>
    </div>
  );
}