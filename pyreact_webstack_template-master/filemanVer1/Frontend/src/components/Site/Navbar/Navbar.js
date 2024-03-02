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
  Avatar,
  Collapse
} from "@material-ui/core";
import { AccountCircle, TrendingUp } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import api from "../../Services/token_refresh";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Grid from "@material-ui/core/Grid";
import getUser from "../../Dashboard/getUser";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import useMediaQuery from '@mui/material/useMediaQuery';
import HomeIcon from '@mui/icons-material/Home';
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

export default function Navbar( {expanded, setExpanded,setCreatePostExpanded}) {
  const mobile = useMediaQuery('(min-width:700px)');
  const fullSize = useMediaQuery('(min-width:1000px)');
  const email = localStorage.getItem("email");
  const access = localStorage.getItem("access");
  const [loggedIn, setLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchExpand, setSearchExpand] = useState(false);
  const { userData, loading, error } = getUser(email, access);
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
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login/');
  }
  const handleSignUp = () => {
    navigate('/signup/');
  }
  const handleExpandClick = () =>{
    if (!expanded) {setCreatePostExpanded(false);}
    setExpanded(!expanded);
    
  }
  const handleHomeClick = () => {
    navigate('/dash/');
  }
  return (
    <div>
      
{ !mobile ? 
    (
    // Mobile
    <div>
      
      <AppBar position="fixed">
      <Toolbar >
      <Grid container direction="row"
justifyContent="space-between"
alignItems="center"> 
      {loggedIn ? (
        <>
          <Grid item lg={1}>

          <Button onClick={() => handleHomeClick()}>
            <HomeIcon sx={{color: "white"}}/>
          </Button> 
          </Grid>
          
          <Grid item xs={searchExpand? 2 : 1} md={3}>
            <SearchBar setHoistExpand={setSearchExpand}/>
          </Grid>
          <Collapse in={!searchExpand}>
          <Grid item lg={1}>
            <Button onClick={() => handleExpandClick()}>
              <Inventory2Icon sx={{color: "white"}}/>
            </Button> 
          </Grid>
          </Collapse>
          <Grid item lg={1}> 
          <Collapse in={!searchExpand && !fullSize && !mobile}>
            <Button
            color="inherit"
            onClick={handleMenuOpen}
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            sx={{display: searchExpand}}
            endIcon={userData ? (<Avatar src={userData.profile_pic}>{userData.profile_pic ? "":  userData.first_name.charAt(0)}</Avatar>
            ):(<AccountCircle  />)}
            
            >
            
        
        
          </Button>
          
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
          </Collapse>
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
  </AppBar></div>
  // Desktop
  ) : (
    <div>
      <AppBar position="fixed">
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
              
              <Grid item xs={2} md={3}>
                <SearchBar setHoistExpand={setSearchExpand}/>
              </Grid>
              <Collapse in={!searchExpand&& mobile}>
              <Grid item>
              <Button onClick={() => setExpanded(!expanded)}>
                <Inventory2Icon sx={{color: "white"}}/>
              </Button> 
              </Grid>
              </Collapse>
              <Grid item>

              <Button
                color="inherit"
                onClick={handleMenuOpen}
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                endIcon={userData ? (<Avatar src={userData.profile_pic}>{userData.profile_pic ? "":  userData.first_name.charAt(0)}</Avatar>
                ):(<AccountCircle  />)}
                
              >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{spacing:2}}
            >
            <Grid item>
              <Typography>{userData? (userData.first_name): ("")}</Typography>
              </Grid>
              
            </Grid>
            
            
              </Button>
              
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
    </div>)}
    </div>
  );
}