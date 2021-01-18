import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import ScreamDialog from "./ScreamDialog";

import { connect } from "react-redux";
import MyButton from "../util/MyButton";
import ChatIcon from "@material-ui/icons/Chat";
import DeleteScream from "./DeleteScream";
import LikeButton from "./Likebutton";
const styles = {
  card: {
    marginBottom: 20,
    display: "flex",
    position: "relative",
  },
  image: {
    minWidth: "200px",
  },
  content: {
    padding: 25,
  },
};

class Scream extends Component {
  render() {
    // time formatter helper
    dayjs.extend(relativeTime);

    const {
      classes,
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        likeCount,
        screamId,
        commentCount,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScream screamId={screamId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={userImage}
          title="Profile image"
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          {deleteButton}

          <Typography variant="body2">{dayjs(createdAt).fromNow()}</Typography>
          <Typography variant="body1">{body}</Typography>
          <LikeButton screamId={screamId} />
          <span>
            {likeCount} {likeCount > 1 || likeCount === 0 ? "Likes" : "Like"}
          </span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>
            {commentCount}{" "}
            {commentCount > 1 || commentCount === 0 ? "Comments" : "Comment"}
          </span>
          <ScreamDialog screamId={screamId} userHandle={userHandle} />
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
