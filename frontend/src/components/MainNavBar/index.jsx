import React, { Component } from 'react'
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { connect } from 'react-redux';
import logo from "../../logo192.png";
import { Link } from "react-router-dom";

class MainNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username
    }
  }
  componentWillReceiveProps(newProps){
    this.setState({
      username: newProps.username
    });
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
            <Nav.Link href="#home">About</Nav.Link>
            <Nav.Link href="#link">Devices</Nav.Link>
            <Nav.Link href="#user">{this.state.username}  </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

const mapStateToProps = newState => {
  return {
    username: newState.username
  };
};



export default connect(mapStateToProps)(MainNavBar);