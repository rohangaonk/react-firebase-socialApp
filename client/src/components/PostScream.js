import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import MyButton from "../util/MyButton";
import CloseIcon from "@material-ui/icons/Close";
import { Button, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { postScream } from "../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.customStyles,
  submitButton: {
    position: "relative",
  },
  progressSpinner: {
    position: "absolute",
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    top: "10%",
  },
  customeError: {
    border: "1px solid red",
    borderRadius: 5,
    color: "red",
    padding: 5,
    width: "50%",
    margin: "5px auto 5px auto",
  },
});
class PostScream extends Component {
  state = {
    open: false,
    body: "",
    error: "",
  };
  static getDerivedStateFromProps;

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.body.trim() === "") {
      this.setState({ error: "Scream must not be empty" });
      return;
    }
    this.setState({ error: "" });
    this.props.postScream({ body: this.state.body });
  };
  render() {
    const { error } = this.state;
    const {
      classes,
      UI: { loading, uiError },
    } = this.props;
    return (
      <>
        <MyButton onClick={this.handleOpen} tip="Post a Screm">
          <AddIcon />
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
          <DialogTitle>Post a new scream</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="body"
                value={this.state.body}
                type="text"
                label="Scream!"
                multiline
                rows="3"
                placeHolder="Scream at your fellow apes"
                error={error ? true : false}
                helperText={error ? error : null}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              {uiError && (
                <Typography variant="body2" className={classes.customeError}>
                  {uiError}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Submit
                {loading && (
                  <CircularProgress
                    size={30}
                    className={classes.progressSpinner}
                  />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  UI: state.ui,
});

export default connect(mapStateToProps, { postScream })(
  withStyles(styles)(PostScream)
);
