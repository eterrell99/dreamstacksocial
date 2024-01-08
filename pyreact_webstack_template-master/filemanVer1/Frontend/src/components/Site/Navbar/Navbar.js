import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { AccountCircle } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import api from "../../Services/token_refresh";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Grid from "@material-ui/core/Grid";
const useStyles = makeStyles((theme) => ({
    title: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    menu: {
      marginTop: theme.spacing(4),
      marginRight: theme.spacing(2),
    },
    menuItem: {
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    menuIcon: {
      marginRight: theme.spacing(1),
    },
  }));

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();
  useEffect(() => {
    // Check if the user is logged in
    const checkLoginStatus = async () => {
      const access = localStorage.getItem("access");
      if (access) {
        try {
          const response = await api.post("token/verify/", {token: access}); // Adjust the URL
          if (response.status === 200) {
            setLoggedIn(true);
          }
        } catch (error) {
          // Token validation failed or other error
          navigate('/')
          console.error("Token validation error:", error);
        }
      }
    };

    checkLoginStatus();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateHome = (e) => {
      e.preventDefault();
      navigate('/');
  };
  const handleNavigateProfile = (e) => {
    e.preventDefault();
    navigate('/profile/');
};

  const handleLogout = () => {
    // Perform logout actions (e.g., clear tokens, redirect)
    const loggoutUser = async () => {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          try {
            const response = await api.post("token/blacklist/", {refresh: refresh}); // Adjust the URL
            if (response.status === 200) {
              setLoggedIn(false);
            }
          } catch (error) {
            // Token validation failed or other error
            console.error("Token validation error:", error);
          }
        }
      };
  
      loggoutUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    setLoggedIn(false);
    // Redirect or show a confirmation message
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar >
          <Grid container direction="row"
  justifyContent="space-between"
  alignItems="center"> 

          <Grid item>
            <Typography onClick={((e)=>handleNavigateHome(e))} variant="h6" className={classes.title}>
              Your App
            </Typography>
          </Grid>
          {loggedIn ? (
            <>
              <Grid item>
                <SearchBar/>
              </Grid>

              <Grid item>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                className={classes.menuButton}
              >
                <AccountCircle />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                className={classes.menu}
              >
                <MenuItem
                  onClick={((e)=> handleNavigateProfile(e))}
                  className={classes.menuItem}
                >
                  <AccountCircle className={classes.menuIcon} />
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  className={classes.menuItem}
                >
                  <LogoutIcon className={classes.menuIcon} />
                  Logout
                </MenuItem>
                {/* Add other menu items for user profile, settings, etc. */}
              </Menu>
              </Grid>
            </>
          ) : (
            <>
            
              <Button color="inherit">Login</Button>
              <Button color="inherit">Sign Up</Button>
            </>
          )}
          
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}