import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ItemContainer from "../ItemContainer";
import Spinner from 'react-bootstrap/Spinner'
import Requests from '../../utils/requests.js'
import { setUser } from "../../utils/redux/actions";
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

const { Formik } = require("formik");
const yup = require("yup");

const schema = yup.object({
  username: yup.string().required("Username is required!"),
  password: yup.string().required("Password is required!")
});


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      badRequestError: false,
      unAuthorizedError: false,
      serverError: false,
      notFoundError: false,
      done: false, 
      from: (props.location.state) ? props.location.state.from : ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(signinRequest) {
    this.setState({ loading: true, badRequestError: false, unAuthorizedError: false, notFoundError: false, serverError: false, done: false });
    Requests.signin(signinRequest).then((result) => {
      if (result.status === 400) {
        this.setState({ loading: false, badRequestError: true });
      } else if (result.status === 401) {
        this.setState({ loading: false, unAuthorizedError: true });
      } else if (result.status === 404) {
        this.setState({ loading: false, notFoundError: true });
      } else if (result.status && result.status !== 200) {
        this.setState({ loading: false, serverError: true })
      } else {
        this.props.setUser(result.username);
        this.setState({ loading: false, done: true });
      }
    })
  }

  render() {
    return (
      <ItemContainer>
        {this.state.done ? ((this.props.location.state) ? <Redirect
          to={{
            pathname: this.state.from
          }}
        /> : this.props.history.goBack()) : ""}

        <h1>Login</h1>
        <Formik
          validationSchema={schema}
          onSubmit={this.handleSubmit}
          initialValues={{
            username: "",
            password: ""
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
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="Username"
                    required placeholder="Enter Username"
                    onChange={handleChange}
                    value={values.username}
                    name="username"
                    isInvalid={(touched.username && !!errors.username)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {!!errors.username ? <div>{errors.username}</div> : ""}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                {this.state.serverError ? <div className="error-text"> A server error has occured</div> : ""}
                {this.state.badRequestError ? <div className="error-text"> Bad Request!</div> : ""}
                {this.state.unAuthorizedError ? <div className="error-text"> Wrong Password</div> : ""}
                {this.state.notFoundError ? <div className="error-text"> User not found</div> : ""}

                <Button variant="primary" type="submit" disabled={this.state.loading}>
                  Login
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
              </Form>)}
        </Formik>
      </ItemContainer>
    );
  }
}
export default withRouter(connect(
  null,
  {
    setUser: setUser
  }
)(Login));
