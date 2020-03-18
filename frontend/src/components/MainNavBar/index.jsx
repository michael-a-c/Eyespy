import React, { Component } from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { connect } from 'react-redux';
import logo from "../../logo192.png";
import { Link } from "react-router-dom";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { removeUser } from "../../utils/redux/actions";

import Requests from '../../utils/requests.js';

import './styles.scss';

class MainNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      loggedIn: props.loggedIn
    }
    this.handleSignout = this.handleSignout.bind(this);

  }
  componentWillReceiveProps(newProps) {
    this.setState({
      username: newProps.username,
      loggedIn: newProps.loggedIn
    });
  }
  handleSignout(e) {
    Requests.signout().then((response) => {
      this.props.removeUser();
      console.log(response);
    })
  }
  render() {
    return (
      <Navbar variant="dark" bg="dark" expand="lg">
        <Link style={{ textDecoration: 'none' }} to="/">
          <Navbar.Brand className="navbar-brand">
            <img
              src={logo}
              width="50"
              height="50"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
            <div className="navbar-text">EyeSpy</div>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/devices">Devices</Nav.Link>
            <Nav.Link href="/pushnotifications">Push Notifications (Beta)</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto ">
            <DropdownButton variant="secondary" className="navbar-dropdown" id="dropdown-item-button" alignRight title={(this.state.loggedIn) ? this.state.username : "Not Logged In"}>
              {this.state.loggedIn ? <Dropdown.Item as="button" onClick={this.handleSignout}>Sign Out</Dropdown.Item> : ""}
              <Link className="navbar-custom-link" to="/login"><Dropdown.Item as="button">Login</Dropdown.Item></Link>
              {this.state.loggedIn ? <Link className="navbar-custom-link" to="/account"><Dropdown.Item as="button">Your Account</Dropdown.Item> </Link>: ""}
              {!this.state.loggedIn ? <Link className="navbar-custom-link" to="/signup"><Dropdown.Item as="button" >Sign up</Dropdown.Item></Link> : ""}

            </DropdownButton>
          </Nav>
        </Navbar.Collapse >
      </Navbar >
    )
  }
}

const mapStateToProps = newState => {
  return {
    username: newState.username,
    loggedIn: newState.loggedIn
  };
};

export default connect(mapStateToProps, { removeUser: removeUser })(MainNavBar);