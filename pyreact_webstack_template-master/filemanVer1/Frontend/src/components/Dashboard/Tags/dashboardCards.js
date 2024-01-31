import React from "react";
import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
}));

const DashboardCard = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;