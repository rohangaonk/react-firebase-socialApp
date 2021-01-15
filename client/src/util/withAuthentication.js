import React from "react";
import jwtDecode from "jwt-decode";

function withAuthentication(Component) {
  return class extends React.Component {
    state = {
      authenticated: false,
    };

    componentDidMount() {
      const token = localStorage.FBIdToken;
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now())
          this.setState({ authenticated: true });
      }
    }
    render() {
      return (
        <Component authenticated={this.state.authenticated} {...this.props} />
      );
    }
  };
}

export default withAuthentication;
