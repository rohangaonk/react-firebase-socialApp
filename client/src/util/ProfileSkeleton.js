import { withStyles } from "@material-ui/core";
import React from "react";
import NoImg from "../images/no-img.png";
import Paper from "@material-ui/core/Paper";

import LocationOnIcon from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";

const styles = (theme) => ({
  ...theme.customStyle,
  paper: {
    padding: 20,
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%",
    },
    "& .profile-details": {
      textAlign: "center",
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0",
    },
  },
  handle: {
    height: 20,
    backgroundColor: theme.palette.primary.main,
    width: 60,
    margin: "0 auto 7px auto",
  },

  halfLine: {
    margin: "0px auto 10px auto",
    height: 15,
    width: "50%",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});

const ProfileSkeleton = (props) => {
  const { classes } = props;

  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={NoImg} alt="profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
          <div className={classes.handle}></div>
          <hr />
          <div className={classes.halfLine}></div>
          <div className={classes.halfLine}></div>
          <hr />
          <LocationOnIcon color="primary" />
          <hr />
          <LinkIcon color="primary" />
          <hr />
          <CalendarTodayIcon color="primary" />
        </div>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(ProfileSkeleton);
