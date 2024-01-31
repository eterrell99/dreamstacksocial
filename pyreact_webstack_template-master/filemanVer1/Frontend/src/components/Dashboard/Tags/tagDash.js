import React, { useEffect, useState } from "react";
import Navbar from "../../Site/Navbar/Navbar"
import getUser from "../getUser";
import api from "../../Services/token_refresh";
import TagsList from "../TagList";
import TagSearch from "../tagSearch";
import DashboardCard from "./dashboardCards";
import {
  Button,
  IconButton,
  makeStyles,
  Container,
  Grid,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flex: 1,
    paddingLeft: "25px",
    marginLeft: (expanded) => (expanded ? "200px" : "0"),
  },
}));

export default function TagDash() {
  const email = localStorage.getItem("email");
  const access = localStorage.getItem("access");
  const [topTags, setTopTags] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedTags, setSelectedTags] = useState();
  useEffect(() => {
    const fetchTopTags = async () => {
      try {
        const response = await api.get(`tag/top/`);
        setTopTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTopTags();
  }, []);

  const { userData, loading, error } = getUser(email, access);

  const classes = useStyles(expanded);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={classes.root}>
      <Navbar />
      <Container>
        <Grid container spacing={3}>
          {/* Tags List */}
          <Grid item xs={3}>
            <TagsList tags={topTags} expanded={expanded} />
          </Grid>

          {/* Main Content */}
          <Grid item xs={9} className={classes.content}>
            <TagSearch tags={topTags} hoistTags={setSelectedTags}/>
            <Button
              onClick={() => setExpanded(!expanded)}
              variant="outlined"
              color="primary"
            >
              {expanded ? "Collapse Tags" : "Expand Tags"}
            </Button>

            {/* Dashboard Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DashboardCard title="Recent Posts">
                  {/* Render recent posts or any other content */}
                </DashboardCard>
              </Grid>
              <Grid item xs={6}>
                <DashboardCard title="Favorites">
                  {/* Render favorite posts or any other content */}
                </DashboardCard>
              </Grid>
              <Grid item xs={6}>
                <DashboardCard title="Notifications">
                  {/* Render notifications or any other content */}
                </DashboardCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
