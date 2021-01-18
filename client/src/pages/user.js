import React, { Component } from "react";
import axios from "axios";
import Scream from "../components/Scream";
import Grid from "@material-ui/core/Grid";
import StaticProfile from "../components/StaticProfile";
import ScreamSkeleton from "../util/ScreamSkeleton";

import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";
import ProfileSkeleton from "../util/ProfileSkeleton";

class user extends Component {
  state = {
    profile: null,
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({ profile: res.data.user });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { screams, loading } = this.props.data;
    const screamsMarkup = loading ? (
      <ScreamSkeleton />
    ) : screams === null ? (
      <p>No screams for this user</p>
    ) : (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    );
    return (
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {screamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserData })(user);
