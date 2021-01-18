import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { connect } from "react-redux";
import { submitComment } from "../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.customStyles,
  button: {
    float: "right",
    marginBottom: 10,
  },
});

class CommentForm extends Component {
  state = {
    body: "",
    error: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.body.trim())
      this.setState({ error: "Cannot have empty comment" });
    else {
      this.setState({ error: "" });
      this.props.submitComment(this.props.screamId, {
        body: this.state.body,
      });
    }
  };

  render() {
    const { classes, screamId, authenticated } = this.props;

    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="body"
            type="text"
            label="Comment on Scream"
            error={!!this.state.error}
            helperText={this.state.error}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Submit
          </Button>
        </form>
        <hr className={classes.visibleSeparator} />
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

const mapStateToProps = (state) => ({
  UI: state.ui,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { submitComment })(
  withStyles(styles)(CommentForm)
);
