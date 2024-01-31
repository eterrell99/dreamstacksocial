import React, { useState, useEffect } from "react";
import useGetUser from "../Dashboard/getUser";
import axios from "axios";
import api from "../Services/token_refresh"
import Navbar from "../Site/Navbar/Navbar";

import {
  Container,
  Typography,
  Grid,
  Paper,
  makeStyles,
  Avatar,
  Divider,
  Box,
  Button,
  TextField,
  
} from "@material-ui/core";

import { TryOutlined } from "@mui/icons-material";
import PostList from "./userPosts";



const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  editField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

export default function Profile() {
const email = localStorage.getItem("email");
const access = localStorage.getItem("access");
const classes = useStyles();
const [userPosts, setUserPosts] = useState();
const { userData, loading, error } = useGetUser(email, access);

const [editMode, setEditMode] = useState(false);
const [editedData, setEditedData] = useState({ ...userData });
// Initialize editedData with userData when the component is first rendered

useEffect(()=> {
    setEditedData({...userData})
}, [userData]);


const handleEditClick = () => {
  setEditMode(true);
};

const handleSaveClick = async () => {
  try {
    const updateUserUrl = `/api/user/${userData.id}/`;
    const response = await api.patch(updateUserUrl, editedData, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    console.log("User data updated:", response.data);

    setEditMode(false);
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

const handleCancelClick = () => {
  // Reset editedData to match userData
  setEditedData({ ...userData });
  setEditMode(false);
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  
  // Update the editedData state with the changed field
  setEditedData({
    ...editedData,
    [name]: value,
  });
};
useEffect(() => {
  const fetchUserPosts = async () => {
    try {
      if (userData && userData.id) {
        const response = await api.get(`/post/user/${userData.id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        setUserPosts(response.data);
      } else {
        console.error("User data or user ID is null or undefined.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Handle the error as needed
    }
  };

  fetchUserPosts();
}, [userData]);

if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error: {error.message}</div>;
}
  return (
    <div><Navbar/>
    <Container maxWidth="md"> 
      <Paper className={classes.paper} elevation={3}>
        <Grid container spacing={2} direction="row" justifyContent="flex-start"
  alignItems="center">
          <Grid item>
            <Avatar className={classes.avatar} src={editedData.profile_pic} >{editedData.first_name ? editedData.first_name.charAt(0) : ""}</Avatar>
          </Grid>
          <Grid item>  
            <Typography variant="h4" gutterBottom>
            {editMode ? (
              <div>
              <TextField
                name="first_name"
                value={editedData.first_name}
                onChange={handleInputChange}
                className={classes.editField}
                label="First Name"
              />
              <Divider className={classes.divider} />
              <TextField
                name="last_name"
                value={editedData.last_name}
                onChange={handleInputChange}
                className={classes.editField}
                label = "Last Name"
              />
              </div>
            ) : (
              `${editedData.first_name} ${editedData.last_name}`
            )}
          </Typography>
          </Grid>
          <Grid item>
          <Typography variant="subtitle1" gutterBottom>
          Date Joined: {new Date(userData.date_joined).toLocaleString()}
        </Typography>
          </Grid>
        </Grid>

        {editMode ? (
          <TextField
            name="bio"
            label="Bio"
            multiline
            minRows={4}
            fullWidth
            value={editedData.bio || ""}
            onChange={handleInputChange}
            className={classes.editField}
          />
        ) : (
          <Typography variant="subtitle1" gutterBottom>
            Bio: {editedData.bio || "No bio available"}
          </Typography>
        )}
        {editMode ? (
          <TextField
            name="title"
            label="Title"
            fullWidth
            value={editedData.title || ""}
            onChange={handleInputChange}
            className={classes.editField}
          />
        ) : (
          <Typography variant="subtitle1" gutterBottom>
            Title: {editedData.title || "No title"}
          </Typography>
        )}
        {editMode ? (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveClick}
              className={classes.button}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelClick}
              className={classes.button}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
            className={classes.button}
          >
            Edit Profile
          </Button>
          
        )}
        <Divider className={classes.divider} />
        {userPosts ? (<PostList posts={userPosts}/>) : (<div></div>)}
      </Paper>
    </Container>
    </div>
  );
}