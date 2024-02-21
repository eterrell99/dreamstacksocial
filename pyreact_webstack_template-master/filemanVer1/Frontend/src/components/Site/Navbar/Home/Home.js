import React, { useEffect } from 'react';
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
      <Container>
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
                  Subscription Plan
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Unlock a world of possibilities with our subscription plan.
                </Typography>
                <Typography>
                      *  Text Decoration
                      *  Exclusive Profile Customization

                </Typography>
                <Box>


                    
                </Box>
              </CardContent>
              <CardActions>
                <Button color="primary" endIcon={<ArrowForward />}>Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Ad-Free Experience
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Enjoy Sample Name without any distractions.
                </Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" endIcon={<ArrowForward />}>Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default LandingPage;
