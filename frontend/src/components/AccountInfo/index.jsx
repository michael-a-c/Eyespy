import React, { Component, useState } from 'react'
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ItemContainer from "../ItemContainer";
import Requests from '../../utils/requests.js';
import Form from "react-bootstrap/Form";
import Spinner from 'react-bootstrap/Spinner';
import PasswordModal from "../PasswordModal";
import './styles.scss';

const { Formik } = require("formik");
const yup = require("yup");

const schemaEmail = yup.object({
  email: yup.string().email("Invalid email!").required("Email is required!"),
});
const schemaPhone = yup.object({
  phone: yup.string().matches(/^[1-9]{1}[0-9]{9}$/, "10 digit phone number with area code, no spaces", { excludeEmptyString: true })
});
const schemaPassword = yup.object({
  password: yup.string().required("Password is required!"),
  confirmPassword: yup.string().required("Confirm password is required").test('passwords-match', 'Passwords must match!', function (value) {
    return this.parent.password === value;
  })
});

function ModalController(props) {
  const [show, setShow] = useState(true);
  const [passwordError, setPasswordError] = useState(null);

  const handleClose = (password, close) => {
    if (!close) {
      setShow(false);
      props.callback();
    }
    else if (close) {
      let req = {
        username: props.username,
        password: password,
        newInfo: props.newInfo,
        infoType: null
      };
      if (props.updateEmail) {
        req.infoType = "email";
        console.log(req);
        console.log("cherry");
        Requests.updateInfo(req).then((res) => {
          if (res && res.status == "401") {
            setPasswordError("Invalid Password");
            setShow(true);
          } else if (res && res.status) {
            setPasswordError("Server Error");
            setShow(true);
          } else if (res && !res.status) {
            setPasswordError(null);
            setShow(false);
            props.callback();
          }
        });
      }
      else if (props.updatePhone) {
        req.infoType = "phone";
        Requests.updateInfo(req).then((res) => {
          if (res && res.status == "401") {
            setPasswordError("Invalid Password");
            setShow(true);
          } else if (res && res.status) {
            setPasswordError("Server Error");
            setShow(true);
          } else if (res && !res.status) {
            setPasswordError(null);
            setShow(false);
            props.callback();
          }
        });
      }
      else if (props.updatePassword) {
        req.infoType = "password";
        Requests.updateInfo(req).then((res) => {
          if (res && res.status == "401") {
            setPasswordError("Invalid Password");
            setShow(true);
          } else if (res && res.status) {
            setPasswordError("Server Error");
            setShow(true);
          } else if (res && !res.status) {
            setPasswordError(null);
            setShow(false);
            props.callback();
          }
        });
      }
    }
  };
  return (
    <PasswordModal
      show={show}
      handleClose={handleClose}
      error={passwordError}
    />
  );
}

export default class AccountInfo extends Component {
  constructor(props) {
    super(props);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.handleSubmitEmail = this.handleSubmitEmail.bind(this);
    this.handleSubmitPhone = this.handleSubmitPhone.bind(this);
    this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = {
      username: null,
      email: null,
      phone: null,
      shouldRenderPasswordModal: false,
      updateEmail: false,
      updatePhone: false,
      updatePassword: false,
      newInfo: null,
      defaultValue: ""
    }
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    Requests.getUserInfo().then((result) => {
      this.setState({ username: result.username })
      this.setState({ email: result.email });
      let phone = result.phone;
      if (phone == "") {
        phone = "N/A"
      }
      this.setState({ phone: phone });
    })
  }

  closeModal() {
    this.setState({ shouldRenderPasswordModal: false });
    this.setState({ updateEmail: false });
    this.setState({ updatePhone: false });
    this.setState({ updatePassword: false });
    this.setState({ newInfo: null });
    this.getUserInfo();
  }

  handleSubmitEmail(submitRequest) {
    console.log(this.state.username);
    this.setState({ updateEmail: true });
    this.setState({ newInfo: submitRequest.email });
    this.setState({ shouldRenderPasswordModal: true });
    submitRequest.email = "";
  }

  handleSubmitPhone(submitRequest) {
    this.setState({ updatePhone: true });
    this.setState({ newInfo: submitRequest.phone });
    this.setState({ shouldRenderPasswordModal: true });
    submitRequest.phone = "";
  }

  handleSubmitPassword(submitRequest) {
    this.setState({ updatePassword: true });
    this.setState({ newInfo: submitRequest.password });
    this.setState({ shouldRenderPasswordModal: true });
    submitRequest.password = "";
  }

  render() {
    return (
      <ItemContainer>
        <h1>Welcome to the Account Info Page {this.state.username}</h1>
        <p>See your current info and update them</p>
        <Accordion>
          <Card className="spades">
            <Card.Header className="hearts">
              <div>Email</div>
              <div>Current Email: {this.state.email}</div>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Edit
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Formik
                  validationSchema={schemaEmail}
                  onSubmit={this.handleSubmitEmail}
                  initialValues={{
                    email: "",
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
                        <Form.Group required controlId="formEmail">
                          <Form.Label>Enter New Email</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            name="email"
                            placeholder="Enter Email"
                            value={values.email}
                            onChange={handleChange}
                            isInvalid={touched.email && !!errors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={this.state.loading}>
                          Update
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
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className="spades">
            <Card.Header className="hearts">
              <div>Phone</div>
              <div>Current Phone: {this.state.phone}</div>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Edit
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Formik
                  validationSchema={schemaPhone}
                  onSubmit={this.handleSubmitPhone}
                  initialValues={{
                    phone: "",
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
                        <Form.Group required controlId="formPhone">
                          <Form.Label>Enter New Phone Number</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            name="phone"
                            placeholder="Enter Phone"
                            value={values.phone}
                            onChange={handleChange}
                            isInvalid={touched.phone && !!errors.phone}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phone}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={this.state.loading}>
                          Update
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
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className="spades">
            <Card.Header className="hearts">
              <div>Password</div>
              <Accordion.Toggle as={Button} variant="link" eventKey="2">
                Edit
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <Formik
                  validationSchema={schemaPassword}
                  onSubmit={this.handleSubmitPassword}
                  initialValues={{
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
                        <Form.Group controlId="formPassword">
                          <Form.Label>Enter New Password</Form.Label>
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
                        <Button variant="primary" type="submit" disabled={this.state.loading}>
                          Update
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
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        {this.state.shouldRenderPasswordModal ? (
          <ModalController
            username={this.state.username}
            updateEmail={this.state.updateEmail}
            updatePhone={this.state.updatePhone}
            updatePassword={this.state.updatePassword}
            newInfo={this.state.newInfo}
            callback={this.closeModal}
          />
        ) : (
            ""
          )}
      </ItemContainer>
    )
  }
}
