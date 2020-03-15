import React from "react";
import About from "./components/About";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import MainNavbar from "./components/MainNavBar";
import PushNotifications from "./components/PushNotifications";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import AccountInfo from "./components/AccountInfo";
import SetupWebcam from "./components/SetupWebcam";
import { connect } from 'react-redux';
import ReactNotification from 'react-notifications-component'
import Watch from "./components/Watch";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ loggedIn, path, targetComponent, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedIn ? (
          targetComponent,
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location.pathname }
              }}
            />
          )
      }
    />
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: props.loggedIn,
      username: props.username
    }
  }
  render() {
    return (
      <BrowserRouter>
        <ReactNotification />
        <Helmet>
          <meta name="theme-color" content="#343a40" />
          <title>EyeSpy</title>
        </Helmet>
        <MainNavbar />

        <Switch>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <PrivateRoute loggedIn={this.props.loggedIn} exact path="/pushnotifications">
            <PushNotifications />
          </PrivateRoute>
          <PrivateRoute loggedIn={this.props.loggedIn} exact path="/account">
            <AccountInfo />
          </PrivateRoute>
          <PrivateRoute loggedIn={this.props.loggedIn} exact path="/record">
            <SetupWebcam />
          </PrivateRoute>
          <PrivateRoute loggedIn={this.props.loggedIn} path="/watch/:id" component={Watch} />
          <Route exact path="/">
            <Welcome loggedIn={this.props.loggedIn} />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = newState => {
  return {
    username: newState.username,
    loggedIn: newState.loggedIn
  };
};

export default connect(mapStateToProps)(App);
