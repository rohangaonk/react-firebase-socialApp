import React, { Component } from "react";
import Scream from "../components/Scream";
import Grid from "@material-ui/core/Grid";
import Profile from "../components/Profile";
import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";

export class home extends Component {
  state = {
    screams: null,
  };
  componentDidMount() {
    this.props.getScreams();
  }
  render() {
    const { screams, loading } = this.props.data;
    let recentScreamMarkup = !loading ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <p>loading...</p>
    );

    return (
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {recentScreamMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  getScreams,
};

export default connect(mapStateToProps, mapActionsToProps)(home);
