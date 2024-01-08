import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper, // Add Paper component from Material-UI
  makeStyles, // Add makeStyles for custom styling
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#a6a6a6',
    backgroundSize: "cover",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    margin: "0 auto",
    padding: '0px'
  },
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background for the form
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

export default function Register() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/user/register/", formData);
      console.log("Registration successful:", response.data);
      navigate('/');
      // You can redirect the user or display a success message here
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle error, display error message, etc.
    }
  };

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Typography variant="h4" align="center">
            User Registration
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password1"
              type="password"
              value={formData.password1}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="password2"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{marginTop:'10px'}}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}