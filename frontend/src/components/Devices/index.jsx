import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import Requests from '../../utils/requests.js';
import FadeIn from 'react-fade-in';

import './styles.scss'

const { Formik } = require("formik");
const yup = require("yup");

require('dotenv').config();

console.log("key: ", process.env.publicVapidKey)

const publicVapidKey = "BN8eHyQuJvNk4XG61iVxdLlS78zHZCspP4TyG5EuOjj1royj3EmCl_R_2Q5-gMxQ2x0OfUByEAzmWTFf2fGyVTo"//process.env.publicVapidKey
const privateVapidKey = "3ki5FfwrzZZcFPD49UeGPXiWCEpvJUjUD1iVlw4HfKo"//process.env.privateVapidKey

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey)



export class Devices extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: props.username,
      showRegister: false,
      subscription: null,
      devices: []
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSubscription = this.getSubscription.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.sendNotifications = this.sendNotifications.bind(this);
    this.removeDevice = this.removeDevice.bind(this);
  };

  /*
    componentDidMount() {
      window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        return ev.returnValue = 'Are you sure you want to close?';
      });
    }
  
    componentWillUnmount() {
      window.removeEventListener('beforeunload');
    }
  */
  componentWillMount() {
    this.getSubscription();
    this.getDevices();
  }

  handleShow() {
    this.setState({ showRegister: true });
  }

  handleClose() {
    this.setState({ showRegister: false })
  }

  getSubscription() {
    if ('serviceWorker' in navigator) {

      navigator.serviceWorker.ready.then((registration) => {
        if (!registration.pushManager) {
          console.log('Push manager unavailable.')
          return
        }

        registration.pushManager.getSubscription().then((existedSubscription) => {
          if (existedSubscription === null) {
            console.log('No subscription detected, make a request.')
            registration.pushManager.subscribe({
              applicationServerKey: convertedVapidKey,
              userVisibleOnly: true,
            }).then((newSubscription) => {
              console.log('New subscription added.')
              this.setState({ subscription: newSubscription })
              //// update this subscription to backend ??? (ERROR ATM)
            }).catch(function (e) {
              if (Notification.permission !== 'granted') {
                console.log('Permission was not granted.')
              } else {
                console.error('An error ocurred during the subscription process.', e)
              }
            })
          } else {
            console.log('Existed subscription detected.')
            this.setState({ subscription: existedSubscription })
            ////update this subscription to backend
          }
        })
      })
        .catch(function (e) {
          console.error('An error ocurred during Service Worker registration.', e)
        })
    }
  }

  getDevices() {
    Requests.getdevices().then((result) => {
      if (result.status === 400) {
        //this.setState({ loading: false, badRequestError: true });
      } else if (result.status === 401) {
        //this.setState({ loading: false, unAuthorizedError: true });
      } else if (result.status === 404) {
        //this.setState({ loading: false, notFoundError: true });
      } else if (result.status === 409) {
        //this.setState({ loading: false, conflictError: true });
      } else if (result.status && result.status !== 200) {
        //this.setState({ loading: false, serverError: true })
      } else {
        //this.setState({ loading: false })
        this.setState({ devices: result.devices })
        console.log(result.message)
      }
    })
  }

  removeDevice(device) {
    console.log("remove:", device)
    Requests.removedevice(device).then((result) => {
      if (result.status === 400) {
        this.setState({ loading: false, badRequestError: true });
      } else if (result.status === 401) {
        this.setState({ loading: false, unAuthorizedError: true });
      } else if (result.status === 404) {
        this.setState({ loading: false, notFoundError: true });
      } else if (result.status === 409) {
        this.setState({ loading: false, conflictError: true });
      } else if (result.status && result.status !== 200) {
        this.setState({ loading: false, serverError: true })
      } else {
        this.setState({ loading: false });
        console.log(result.message)
        this.getDevices();
      }
    })
  }



handleSubmit(req) {
  this.setState({ loading: true, badRequestError: false, unAuthorizedError: false, notFoundError: false, serverError: false, conflictError: false });
  req.subscription = this.state.subscription
  req.username = this.state.username
  Requests.adddevice(req).then((result) => {
    if (result.status === 400) {
      this.setState({ loading: false, badRequestError: true });
    } else if (result.status === 401) {
      this.setState({ loading: false, unAuthorizedError: true });
    } else if (result.status === 404) {
      this.setState({ loading: false, notFoundError: true });
    } else if (result.status === 409) {
      this.setState({ loading: false, conflictError: true });
    } else if (result.status && result.status !== 200) {
      this.setState({ loading: false, serverError: true })
    } else {
      this.setState({ loading: false });
      console.log(result.message)
      this.handleClose();
      this.getDevices();
    }
  })
}

sendNotification(device) {
  let newBody = {
    subscription: device.subscription,
    title: "INTRUDER DETECTED",
    body: "Your device \"" + device.deviceName + "\" is set up to receive notifications"
  }
  return fetch(`api/serviceworker/sendnotification`, {
    method: 'POST',
    body: JSON.stringify(newBody),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

sendNotifications() {
  for (let i = 0; i < this.state.devices.length; i++) {
    if (this.state.devices[i].isReceivingNotifications) {
      this.sendNotification(this.state.devices[i]);
    }
  }
}

render() {
  return (
    <FadeIn>
      <Jumbotron className="jumbotron-dark jumbotron-welcome">
        <h1>My Devices</h1>
        <div>
          < DeviceList
            devices={this.state.devices}
            removeDevice={this.removeDevice}
          />
        </div>
        <Container fluid className="container-welcome" >
          {!this.props.loggedIn ? <FadeIn> <Row noGutters>
            <Col xs={6} sm={3} md={2} xl={1} className="welcome-button">
              <Button onClick={this.handleShow} variant="primary">Register this device</Button>
            </Col>
            <Col xs={6} sm={3} md={2} xl={1} className="welcome-button">
              <Button onClick={this.sendNotifications} variant="primary">Send out notifications</Button>
            </Col>
          </Row></FadeIn> : ""}
        </Container>
      </Jumbotron>



      <Modal show={this.state.showRegister} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Register this device</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Formik
            validationSchema={yup.object({ deviceName: yup.string().required("Device Name is required!") })}
            onSubmit={this.handleSubmit}
            initialValues={{
              username: null,
              deviceName: "",
              serviceWorker: {
                subscription: null
              },
              isRecording: false,
              isReceivingNotifications: true
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
                    <Form.Label>Device Name</Form.Label>
                    <Form.Control
                      type="Username"
                      required placeholder="Enter Device Name"
                      onChange={handleChange}
                      value={values.deviceName}
                      name="deviceName"
                      isInvalid={(touched.deviceName && !!errors.deviceName)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {!!errors.deviceName ? <div>{errors.deviceName}</div> : ""}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {this.state.conflictError ? <div className="error-text"> This device already exists</div> : ""}
                  {this.state.serverError ? <div className="error-text"> A server error has occured</div> : ""}
                  {this.state.badRequestError ? <div className="error-text"> Bad Request!</div> : ""}
                  {this.state.unAuthorizedError ? <div className="error-text"> Wrong Password</div> : ""}
                  {this.state.notFoundError ? <div className="error-text"> User not found</div> : ""}

                  <Button variant="primary" type="submit" disabled={this.state.loading}>
                    Add this Device
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

        </Modal.Body>
      </Modal>
    </FadeIn>

  )
}
}

function Bell() {
  return (<span role="img" aria-label="bell">🔔</span>)
}

function DeviceList(props) {

  if (!props.devices) {
    return ("loading")
  }
  const devicesList = props.devices.map((device) =>
    <h6 key={device.deviceName}>
      • {device.deviceName}
      {device.isReceivingNotifications ?
        <span>{' '}<Badge variant="warning"><Bell />Receiving Notifications<Bell /></Badge></span> :
        ""}
      {device.isRecording ?
        <span>{' '}<Badge variant="danger">•Recording•</Badge></span> :
        ""}
      {' '}<Button onClick={() => props.removeDevice(device)} variant="danger" type="submit">X</Button>
    </h6>
  );
  return (
    <div>
      {devicesList}
    </div>
  );
}

export default Devices


