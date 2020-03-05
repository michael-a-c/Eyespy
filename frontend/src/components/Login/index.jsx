import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ItemContainer from "../ItemContainer";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <ItemContainer>
          <h1>Login</h1>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="Username" required placeholder="Enter Username" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" required placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
      </ItemContainer>
    );
  }
}

export default Login;
