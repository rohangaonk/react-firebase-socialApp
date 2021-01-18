import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../util/MyButton";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";

import { connect } from "react-redux";
import { getScream } from "../redux/actions/dataActions";
import Likebutton from "./Likebutton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

const styles = (theme) => ({
  ...theme.customStyles,

  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    left: "90%",
  },
  expandIcon: {
    position: "absolute",
    left: "90%",
  },
  spinnerDiv: {
    textAlign: "center",
    margin: "50px 0px",
  },
});

class ScreamDialog extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
    this.props.getScream(this.props.screamId);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      classes,
      scream: {
        screamId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments,
      },
      UI: { loading },
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={150} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={3}>
        <Grid item sm={5}>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{body}</Typography>
          <Likebutton screamId={screamId} />
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
        </Grid>
        <CommentForm screamId={screamId} />
        <Comments comments={comments} />
      </Grid>
    );
    return (
      <>
        <MyButton
          tip="Expand Scream"
          onClick={this.handleOpen}
          tipClassName={classes.expandIcon}
        >
          <UnfoldMoreIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.ui,
});

const mapActionsToProps = {
  getScream,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ScreamDialog));
