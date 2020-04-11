import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import Requests from '../../utils/requests.js';
import FadeIn from 'react-fade-in';
import { store } from 'react-notifications-component';

import './styles.scss'

const { Formik } = require("formik");
const yup = require("yup");

require('dotenv').config();

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
      notifsPermitted: false,
      deviceValid: false,
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



  isPushNotificationSupported() {
    return "serviceWorker" in navigator && "PushManager" in window;
  }

  // returns default (no response), denied, or granted 
  async askUserPermission() {
    if (typeof Notification !== 'undefined') {
      return await Notification.requestPermission();
    }
    return;
  }

  verifyAddingDevice() {
    console.log("checking")
    if (this.isPushNotificationSupported()) {
      this.askUserPermission().then((allowed) => {
        if (allowed === 'granted') {
          this.setState({ notifsPermitted: true, deviceValid: true });
        } else {
          this.setState({ notifsPermitted: false, deviceValid: true });
        }
      })
    } else {
      this.setState({ notifsPermitted: false, deviceValid: false });
    }
  }

  componentWillMount() {
    this.verifyAddingDevice();
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
    Requests.getUserStreams().then((result) => {
      if (result.length !== 0) {
        let streamC = result.length;
        store.addNotification({
          title: "Cannot remove a device when a stream is active",
          message: `This account has ` + streamC + ` stream(s) active`,
          type: "danger",
          insert: "bottom",
          container: "bottom-center",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3500,
            onScreen: true
          }
        });
      }
      else {
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
    })
  }



  handleSubmit(req) {
    this.setState({ loading: true, badRequestError: false, unAuthorizedError: false, notFoundError: false, serverError: false, conflictError: false });
    Requests.getUserStreams().then((result) => {
      if (result.length !== 0) {
        let streamC = result.length;
        store.addNotification({
          title: "Cannot add a device when a stream is active",
          message: `This account has ` + streamC + ` stream(s) active`,
          type: "danger",
          insert: "bottom",
          container: "bottom-center",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 3500,
            onScreen: true
          }
        });
        this.setState({ loading: false });
        this.handleClose();
      }
      else {
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
            this.getDevices();
            this.handleClose();
          }
        })
      }

    })
  }

  sendNotification(device) {
    let options = {
      subscription: device.subscription,
      title: "Testing Notifications",
      body: "Your device \"" + device.deviceName + "\" is receiving a test notification from EyeSpy Security"
    }
    return fetch(`api/serviceworker/sendnotification`, {
      method: 'POST',
      body: JSON.stringify(options),
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
          <Row>
            <Col><h1>My Devices</h1></Col>
          </Row>

          <Row>
            <Col>
              < DeviceList
                devices={this.state.devices}
                removeDevice={this.removeDevice}
                notifyDevice={this.sendNotification}
              /></Col>
          </Row>
          <Row>
            <Col>
              <Button disabled={!this.state.deviceValid || !this.state.notifsPermitted} onClick={this.handleShow} className="add-device" variant="primary">Add this device</Button>
              {!this.state.deviceValid ? <div className="error-text"> The device is invaild</div> : ""}
              {!this.state.notifsPermitted && this.state.deviceValid ? <div className="error-text"> Please enable notifications for this device</div> : ""}
            </Col>
          </Row>

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

function TrashIcon() {
  return (<span role="img" aria-label="trash">🗑️</span>)
}

function DeviceList(props) {

  if (!props.devices) {
    return ("Attempting to load your devices...")
  }
  let devicesList = props.devices.map((device) =>

    <ListGroup.Item key={device.deviceName} variant="secondary" className="device-row">
      <Row>
        <Col className="device-col" xs={8} md={9} lg={10} xl={10}><h5>{device.deviceName}</h5></Col>
        <Col className="device-col" xs={2} md={1} lg={1} xl={1}><Button className="device-button" onClick={() => props.notifyDevice(device)} variant="warning" type="submit"><Bell></Bell></Button></Col>
        <Col className="device-col" xs={2} md={2} lg={1} xl={1}><Button className="device-button" onClick={() => props.removeDevice(device)} variant="danger" type="submit"><TrashIcon></TrashIcon></Button></Col>
      </Row>
    </ListGroup.Item>

  );
  return (
    <ListGroup >
      {devicesList}
    </ListGroup>
  );
}

export default Devices


