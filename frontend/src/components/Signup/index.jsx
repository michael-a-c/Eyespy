import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ItemContainer from "../ItemContainer";
class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      validated: false
    };
  }

  componentDidMount() {
    this.setState({ validated: false });
  }

  handleSubmit(e) {
    /*e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      this.setState({ validated: false });
    } else {
      this.setState({ validated: true });
    }
    console.log(e);*/
  }

  render() {
    return (
      <ItemContainer>
        <h1>Sign up</h1>
        <p className="subheading-1"> Tell us about yourself</p>
        <Form
          validated={this.state.validated}
          onSubmit={this.handleSubmit}
        >
          <Form.Group required controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Username"
              
            />
            <Form.Control.Feedback type="invalid">
              Invalid Username
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control required type="text" placeholder="Enter Email" />
            <Form.Control.Feedback type="invalid">
              Invalid Email
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" placeholder="Password" />
            <Form.Control.Feedback type="invalid">
              Password is to weak!
            </Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Password does not match!
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formConfirmPassword">
            <Form.Control required type="password" placeholder="Confirm Password" />
            <Form.Control.Feedback type="invalid">
              Password does not match!
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Sign up
          </Button>
        </Form>
      </ItemContainer>
    );
  }
}

export default Signup;
