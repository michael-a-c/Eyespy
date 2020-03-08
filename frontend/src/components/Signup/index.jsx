import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ItemContainer from "../ItemContainer";
import Spinner from 'react-bootstrap/Spinner'
import Requests from '../../requests.js'
const { Formik } = require("formik");
const yup = require("yup");

const schema = yup.object({
  username: yup.string().required("Username is required!"),
  email: yup.string().email("Invalid email!").required("Email is required!"),
  password: yup.string().required("Password is required!"),
  confirmPassword: yup.string().required("Confirm password is required").test('passwords-match', 'Passwords must match!', function (value) {
    return this.parent.password === value;
  })
});

class Signup extends Component {
  constructor(props) {

    super(props);
    this.state = {
      submitted: false,
      loading: false,
      userNameExistsError: false,
      serverError: false,
      badRequestError:false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    //Requests.signup({"username":"111", "password":"asdfasd", "email":"asdf"})
  }
  handleSubmit(submitRequest) {
    this.setState({ loading: true,  userNameExistsError: false, badRequestError: false, serverError: false });
    Requests.signup(submitRequest).then((result) => {
      if(result.status === 409){
        this.setState({ loading: false, userNameExistsError: true });
        
      } else if(result.status === 400){
        this.setState({ loading: false, badRequestError: true });
      }
      else if(result.status === 500){
        this.setState({ loading: false, serverError: true });
      } else{
        this.setState({ loading: false});
      }
    });
  }
  render() {
    return (
      <ItemContainer >
        <h1>Sign up</h1>
        <p className="subheading-1"> Tell us about yourself</p>
        <Formik
          validationSchema={schema}
          onSubmit={this.handleSubmit}
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
          }}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            touched,
            errors,
          }) => (
              <Form
                noValidate
                onSubmit={handleSubmit}
              >
                <Form.Group required controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={(touched.username && !!errors.username) || this.state.userNameExistsError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {!!errors.username ? <div>{errors.username}</div> : ""}
                    {this.state.userNameExistsError ? <div>A user with that username already exists!</div> : ""}

                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword">
                  <Form.Control
                    required
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    isInvalid={touched.confirmPassword && !!errors.confirmPassword && !!errors.confirmPassword}
                    placeholder="Confirm Password" />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                {this.state.serverError ? <div className="error-text"> A server error has occured</div>: ""}
                {this.state.badRequestError ? <div className="error-text"> Bad Request!</div>: ""}

                <Button variant="primary" type="submit" disabled={this.state.loading}>
                  Sign up
                   {this.state.loading ?
                    <Spinner
                      as="span"
                      animation="border"
                      className="button-spinner"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> : ""}
                </Button>
              </Form>
            )}
        </Formik>

      </ItemContainer>
    );
  }
}

export default Signup;
