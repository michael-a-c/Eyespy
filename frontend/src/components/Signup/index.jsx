import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ItemContainer from "../ItemContainer";
import TermsAndConditions from "../TermsAndConditions";
import Spinner from 'react-bootstrap/Spinner';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { withRouter } from 'react-router-dom';
import Requests from '../../utils/requests.js';
import { connect } from 'react-redux';
import { setUser } from "../../utils/redux/actions";


const { Formik } = require("formik");
const yup = require("yup");

const schema = yup.object({
  username: yup.string().required("Username is required!"),
  email: yup.string().email("Invalid email!").required("Email is required!"),
  password: yup.string().required("Password is required!"),
  confirmPassword: yup.string().required("Confirm password is required").test('passwords-match', 'Passwords must match!', function (value) {
    return this.parent.password === value;
  }),
  phone: yup.string().matches(/^[1-9]{1}[0-9]{9}$/, "10 digit phone number with area code, no spaces", {excludeEmptyString: true}),
  terms: yup.string().required("Please read and accept the terms and conditions above")
  //mixed().notOneOf([`[]`]).required()
  //string().matches(/(["\"on\""])/, "please read and accept the terms and conditions")
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
      acceptTerms: false,
      showTerms:false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleTerms = this.toggleTerms.bind(this);
    this.acceptTerms = this.acceptTerms.bind(this);
  }

  toggleTerms(){
    this.setState({ showTerms: !this.state.showTerms });
  }

  acceptTerms() {
    this.setState({ acceptTerms: true });
    this.toggleTerms();
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
        Requests.signin({username: submitRequest.username, password: submitRequest.password}).then((res) =>{
          this.setState({ loading: false});
          this.props.setUser(result.username);

          store.addNotification({
            title: "You've successfully created an account!",
            message: `Welcome to the club, ${result.username}`,
            type: "success",
            insert: "bottom",
            container: "bottom-center",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3500,
              onScreen: true
            }
          });
          this.props.history.goBack();
        })
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
            confirmPassword: "",
            phone: ""
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

                <Form.Group controlId="formPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    //required
                    type="text"
                    placeholder="Enter Phone Number"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    isInvalid={touched.phone && !!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
                {this.state.serverError ? <div className="error-text"> A server error has occured</div>: ""}
                {this.state.badRequestError ? <div className="error-text"> Bad Request!</div>: ""}
                <Button variant="link" onClick={this.toggleTerms}>Terms and Conditions</Button>
                <Form.Group>
                  <Form.Check
                  required
                  disabled={!this.state.acceptTerms}
                  name="terms"
                  label="Agree to Terms and Conditions"
                  onChange={handleChange}
                  isInvalid={touched.phone && !!errors.terms}
                  feedback={errors.terms}
                  />
                </Form.Group>
                <div>You must open the terms and conditions before you can accept them</div>
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
        <Modal size="lg" show={this.state.showTerms} onHide={this.toggleTerms}>
                    <Modal.Header closeButton>Terms and Conditions</Modal.Header>
                    <Modal.Body>
                        <TermsAndConditions/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.toggleTerms}>Do Not Accept</Button>
                        <Button variant="primary" onClick={this.acceptTerms}>Accept</Button>
                    </Modal.Footer>
                </Modal>
      </ItemContainer>
    );
  }
}

export default withRouter(connect(
  null,
  {
    setUser: setUser
  }
)(Signup));
