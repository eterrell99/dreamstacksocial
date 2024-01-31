import React from "react";
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  Container,
  Grid,
  Button,
  IconButton,
} from "@material-ui/core";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useNavigate } from "react-router";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
  },
}));

const PostList = ({ posts }) => {
  const classes = useStyles();
    const navigate = useNavigate();
  return (
    <Container maxWidth="md">
      <Grid container spacing={1} justifyContent="space-evenly"
>
        {posts.map((post) => (
          <Grid item key={post.id}>
            <Card className={classes.card}>
              <CardContent className={classes.content}>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                
                <div className={classes.actions}>
                  <div>
                    <IconButton color="primary" aria-label="like">
                      <ThumbUpIcon />
                    </IconButton>
                    {post.like_count}
                  </div>
                  <div>
                    <IconButton color="secondary" aria-label="comment">
                      <CommentIcon />
                    </IconButton>
                    {post.comment_count}
                  </div>
                  <div><Button onClick={() => navigate(`/post/${post.id}/`)}>See Thread<KeyboardDoubleArrowRightIcon/></Button></div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
    </Container>
  );
};

export default PostList;