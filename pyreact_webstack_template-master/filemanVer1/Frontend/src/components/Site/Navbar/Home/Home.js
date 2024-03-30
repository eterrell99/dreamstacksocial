import React, { useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Button, Card, CardContent, CardActions, makeStyles, IconButton, Box } from "@material-ui/core";
import { AccountCircle, Star, CheckCircle, ArrowForward } from "@material-ui/icons";
import { useNavigate } from 'react-router';
import grey from "../../../../assets/images/grey.jpeg";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    background: '#8EC5FC',
    background: 'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)'
  },
  title: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  titleContainer:{

  },
  titleImg: {
    display:'none'
  },
  card: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      border: '2px solid rgba(0, 0, 0, 0.53)'
    },
  },
  icon: {
    fontSize: 48,
    marginBottom: theme.spacing(2),
  },
  actionIcon: {
    marginLeft: 'auto',
  },
  navButton: {
    marginRight:theme.spacing(2),
  }
}));

const LandingPage = () => {
  const classes = useStyles();
  const splus = useRef(null);
  const startupRef = useRef(null);
  const contactRef = useRef(null);
  const updateRef = useRef(null);
  const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/login/');
    };
    const handleSignUp = (e) => {
        e.preventDefault();
        navigate('/signup/');
    };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Sample Name
          </Typography>
          <Button color="inherit" className={classes.navButton} onClick={(e)=>handleSignUp(e)}>Sign Up</Button>
          <Button color="inherit" className={classes.navButton} onClick={(e)=>handleLogin(e)}>Login</Button>
        </Toolbar>
      </AppBar>
      <Container className={classes.main}>
        <div className={classes.titleContainer}>
            <img src={grey} className={classes.titleImg}/>
            <Typography variant="h4" component="h1" gutterBottom className={classes.title}>
                Welcome to Sample Name
            </Typography>
        </div>
        <Grid container spacing={3} justifyContent="center" alignItems="center" >
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Sample name +
                </Typography>
                <Typography variant="body1" display="block" gutterBottom>
                  Explore new features with our our new user tier, sample name +
                    this tier unlocks exiting features such as:<br/>
                    text decoration<br/>
                    exclusive profile customization<br/>
                    larger file uploads<br/>
                    and more!<br/>
                </Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" endIcon={<ArrowForward /> }   onClick={() =>
          window.scrollTo({
            top: splus.current.offsetTop,
            behavior: "smooth"
          })
        }>Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Startup
                </Typography>
                <Typography variant="body1" gutterBottom>
                  This application was created as a way to help people connect with others and share their ideas.
                  We aprericate all of your support and hope you enjoy using our application.   
                </Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" endIcon={<ArrowForward />} onClick={() =>
          window.scrollTo({
            top: startupRef.current.offsetTop,
            behavior: "smooth"
          })
        }>Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Contact for a demonstration
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Our team is accepting requests for demonstrations of our application.
                </Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" endIcon={<ArrowForward />} onClick={() =>
          window.scrollTo({
            top: contactRef.current.offsetTop,
            behavior: "smooth"
          })
        }>Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Check out our latest update v0.7.2
                </Typography>
                <Typography variant="body1" gutterBottom>
                  
                </Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" endIcon={<ArrowForward />} onClick={() =>
          window.scrollTo({
            top: updateRef.current.offsetTop,
            behavior: "smooth"
          })
        }>Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Card className={classes.card} ref={splus}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Sample name +
                </Typography>
                <Typography variant="body1" gutterBottom>
                  The same sample name you know and love now with added features
                </Typography>
              <Typography variant="body1" gutterBottom> 
              Grow your following with our new user tier, sample name +
              Included Features
              Text decoration
              Exclusive profile customization
              Larger file uploads
              Profile Picture Border
              Post styling
              Join the demo group testing new features like instant messaging and analytics.
              
              </Typography>
              
              </CardContent>
              
            </Card>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Card className={classes.card} ref={startupRef}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Our Startup
                </Typography>
                <Typography variant="body1" gutterBottom>
                  The same sample name you know and love now with added features
                </Typography>
              <Typography variant="body1" gutterBottom> 
              Grow your following with our new user tier, sample name +
              Included Features
              Text decoration
              Exclusive profile customization
              Larger file uploads
              Profile Picture Border
              Post styling
              Join the demo group testing new features like instant messaging and analytics.
              
              </Typography>
              
              </CardContent>
              
            </Card>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Card className={classes.card} ref={contactRef}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Features
                </Typography>
                <Typography variant="body1" gutterBottom>
                  The same sample name you know and love now with added features
                </Typography>
              <Typography variant="body1" gutterBottom> 
              Grow your following with our new user tier, sample name +
              Included Features
              Text decoration
              Exclusive profile customization
              Larger file uploads
              Profile Picture Border
              Post styling
              Join the demo group testing new features like instant messaging and analytics.
              
              </Typography>
              
              </CardContent>
              
            </Card>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Card className={classes.card} ref={updateRef}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Sample name +
                </Typography>
                <Typography variant="body1" gutterBottom>
                  The same sample name you know and love now with added features
                  Grow your following with our new user tier, sample name + <br/>
                </Typography>
              <Typography variant="body1" gutterBottom display='block' textAlig={'left'}> 
              
              * Included Features <br/>
              * Text decoration <br/>
              * Exclusive profile customization<br/>
              * Larger file uploads<br/>
              * Profile Picture Border<br/>
              * Post styling<br/>
              * Join the early access group testing new features like instant messaging and analytics.<br/>
              
              </Typography>
              
              </CardContent>
              
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default LandingPage;
