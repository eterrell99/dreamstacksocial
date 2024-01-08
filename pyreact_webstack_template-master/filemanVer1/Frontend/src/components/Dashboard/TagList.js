import React, { useState } from "react";
import {
  makeStyles,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "200px", // Width when expanded
    height: "100%", // Make it cover the entire height
    backgroundColor: "#f5f5f5",
    overflowY: "auto",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", // Add shadow to separate from content
    transition: "left 0.3s ease", // Smooth transition for left property
  },
  collapsed: {
    left: "-200px", // Move it to the left when collapsed
  },
}));

const TagsList = ({ tags, expanded }) => {
  const classes = useStyles();


  return (
    <Paper
      className={`${classes.root} ${expanded ? "" : classes.collapsed}`}
      elevation={3}
    >
      <List>
        {/* Render your tags here */}
        {tags.map((tag) => (
          <ListItem button key={tag.id}>
            <ListItemText primary={tag.name} />
          </ListItem>
        ))}
      </List>
      {/* Add a button or icon to toggle the expansion */}
      
    </Paper>
  );
};

export default TagsList;