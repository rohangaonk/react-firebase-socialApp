import React, { Component } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";
import { clearError } from "../redux/actions/dataActions";

const style = (theme) => ({ ...theme.customStyles });

const INITIAL_STATE = {
  email: "",
  password: "",
  confirmPassword: "",
  handle: "",
  errors: {
    email: "",
    password: "",
    general: "",
  },
};

class signup extends Component {
  constructor() {
    super();
    this.state = {
      ...INITIAL_STATE,
    };
  }

  componentDidMount() {
    this.props.clearError();
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, handle } = this.state;

    if (
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      handle === ""
    ) {
      this.setState((prevState) => {
        return {
          ...prevState,
          errors: {
            ...prevState.errors,
            email: "",
            password: "",
            general: "All fields are compulsory",
          },
        };
      });
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      this.setState((prevState) => {
        return {
          ...prevState,
          errors: {
            ...prevState.errors,
            email: "Enter Valid Email",
            password: "",
            general: "",
          },
        };
      });
    } else if (password !== confirmPassword) {
      this.setState((prevState) => {
        return {
          ...prevState,
          errors: {
            ...prevState.errors,
            password: "",
            email: "",
            general: "Passwords should match",
          },
        };
      });
    } else if (password.length < 6) {
      this.setState((prevState) => {
        return {
          ...prevState,
          errors: {
            ...prevState.errors,
            password: "Must be atleast 6 characters",
            email: "",
            general: "",
          },
        };
      });
    } else {
      this.setState((prevState) => {
        return {
          ...prevState,
          errors: {
            ...prevState.errors,
            password: "",
            email: "",
            general: "",
          },
        };
      });
      const newUserData = { email, password, handle };
      this.props.signupUser(newUserData, this.props.history);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const {
      classes,
      UI: { loading, uiError },
    } = this.props;
    const { email, password, errors, confirmPassword, handle } = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm></Grid>
        <Grid item sm>
          <Typography className={classes.pageTitle} variant="h4">
            SignUp
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={email}
              onChange={this.handleChange}
              className={classes.textField}
              fullWidth
              helperText={errors.email}
              error={errors.email ? true : false}
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={this.handleChange}
              value={password}
              className={classes.textField}
              fullWidth
              helperText={errors.password}
              error={errors.password ? true : false}
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              onChange={this.handleChange}
              value={confirmPassword}
              className={classes.textField}
              fullWidth
            />
            <TextField
              id="handle"
              name="handle"
              label="Handle"
              type="text"
              onChange={this.handleChange}
              value={handle}
              className={classes.textField}
              fullWidth
            />

            {(errors.general && (
              <Typography variant="body2" className={classes.customeError}>
                {errors.general}
              </Typography>
            )) ||
              (uiError && (
                <Typography variant="body2" className={classes.customeError}>
                  {uiError}
                </Typography>
              ))}
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Sign up
              {loading && (
                <CircularProgress
                  thickness={5}
                  size={25}
                  className={classes.progress}
                />
              )}
            </Button>
            <small>
              Already have an account ? log in <Link to="/login">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm></Grid>
      </Grid>
    );
  }
}
signup.propTypes = {
  classes: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.ui,
});

const mapActionsToProps = {
  signupUser,
  clearError,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(style)(signup));
