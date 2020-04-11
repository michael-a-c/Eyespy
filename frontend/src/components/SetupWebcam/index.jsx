import React, { Component, useState } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import ReactTextTransition, { presets } from "react-text-transition";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Webcam from "react-webcam";
import FadeIn from "react-fade-in";
import Spinner from "react-bootstrap/Spinner";
import Peer from "peerjs";
import { Link } from "react-router-dom";
import * as faceapi from "face-api.js";
import ListGroup from "react-bootstrap/ListGroup";
import PasswordModal from "../PasswordModal";
import "./styles.scss";
import Requests from "../../utils/requests.js";
import ToastNotif from "../ToastNotif";
const { Formik } = require("formik");
const yup = require("yup");
const ref = React.createRef();
const canvasRef = React.createRef();
const motionRef = React.createRef();
const schema = yup.object({
  title: yup.string().required("Title is required"),
  sms: yup.bool("Type Error"),
  push: yup.bool("Type Error"),
  email: yup.bool("Type Error"),
});

function WebcamSelect(props) {
  return (
    <div>
      <Form.Group>
        <Form.Label>Select Webcam</Form.Label>
        <Form.Control as="select">
          {props.availableDevices.map((device) => {
            return (
              <option key={device.id} callback={props.onSelect(device.id)}>
                {device.label}
              </option>
            );
          })}
          }
        </Form.Control>
      </Form.Group>
    </div>
  );
}

function DevicesList(props) {
  if (props.devices.length == 0) {
    return "You currently have no devices set up to recieve push notifications";
  }
  let devicesList = props.devices.map((device) => (
    <ListGroup.Item className="devices-list-actual" key={device.deviceName}>
      <Form.Group className="device-checkbox" controlId={device.deviceName}>
        <Form.Check
          disabled={props.isStreaming}
          type="checkbox"
          label={device.deviceName}
          onChange={(event) => {
            props.selectDevice(device.deviceName);
          }}
        />
      </Form.Group>
    </ListGroup.Item>
  ));
  return (
    <div className="devices-list">
      <ListGroup variant="flush">{devicesList}</ListGroup>
    </div>
  );
}

function ControlPanel(props) {
  return (
    <div className="control-panel">
      <h4 className="status-readout-heading">Control Panel</h4>
      <div className="status-readout-heading control-panel-block">
        <Button
          disabled={!props.isStreaming}
          onClick={props.screenShotCallback}
        >
          Screen Shot
        </Button>
      </div>
      <div className="status-readout-heading control-panel-block">
        <h4>Sensitivity Adjustment</h4>
        <Form.Group controlId="formBasicRangeCustom">
          <Form.Label>Facial Detection Sensitivity</Form.Label>
          <Form.Control
            disabled={props.isStreaming}
            onChange={props.faceSensUpdate}
            type="range"
            custom
          />
        </Form.Group>
        <Form.Group controlId="formBasicRangeCustom">
          <Form.Label>Motion Detection Sensitivity</Form.Label>
          <Form.Control
            disabled={props.isStreaming}
            onChange={props.motionSensUpdate}
            type="range"
            custom
          />
        </Form.Group>
      </div>
      <div className="status-readout-heading control-panel-block">
        <div className="control-panel-heading"> Choose devices</div>

        <div className="control-panel-subtext">
          Chosen Devices will receive push notifications
        </div>

        <DevicesList
          devices={props.devices}
          isStreaming={props.isStreaming}
          selectDevice={props.selectDevice}
        ></DevicesList>
      </div>
    </div>
  );
}

function ModalController(props) {
  const [show, setShow] = useState(true);
  const [passwordError, setPasswordError] = useState(null);

  const handleClose = (password, close) => {
    if (!close) {
      setShow(false);
      props.callback2();
    }
    if (close) {
      let req = {
        username: props.username,
        password: password,
        peerId: props.peerId,
      };
      let notificationoptions = {
        username: props.username,
        peerId: props.peerId,
        pushoptions: {
          title: "Ended the stream: " + props.streamTitle,
          body:
            "If this was not you, consider changing your password immediately",
        },
        smsoptions: {
          title: "Ended stream - " + props.streamTitle,
          body:
            "\nIf this was not you, consider changing your password immediately",
          url: "",
        },
        emailoptions: {
          subject: "Ended the stream: " + props.streamTitle,
          content:
            "If this was not you, consider changing your password immediately",
        },
      };
      console.log("notif:", notificationoptions);
      props.notify(notificationoptions);

      Requests.stopStream(req).then((res) => {
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
  };
  return (
    <PasswordModal
      show={show}
      handleClose={handleClose}
      error={passwordError}
    />
  );
}
class SetupWebcam extends Component {
  constructor(props) {
    super(props);
    this.reload = this.reload.bind(this);
    this.handleStartCam = this.handleStartCam.bind(this);
    this.handleUserDenied = this.handleUserDenied.bind(this);
    this.handleToggleRecord = this.handleToggleRecord.bind(this);
    this.loadFacialDetection = this.loadFacialDetection.bind(this);
    this.doFacialDetection = this.doFacialDetection.bind(this);
    this.stopStreaming = this.stopStreaming.bind(this);
    this.sendNotifications = this.sendNotifications.bind(this);
    this.sendPushNotifications = this.sendPushNotifications.bind(this);
    this.createWebcamList = this.createWebcamList.bind(this);
    this.handleFaceSensUpdate = this.handleFaceSensUpdate.bind(this);
    this.handleMotionSensUpdate = this.handleMotionSensUpdate.bind(this);
    this.selectWebcam = this.selectWebcam.bind(this);
    this.doArmWait = this.doArmWait.bind(this);
    this.activateRecording = this.activateRecording.bind(this);
    this.takeScreenshot = this.takeScreenshot.bind(this);
    this.runMotionDetection = this.runMotionDetection.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.selectDevice = this.selectDevice.bind(this);

    this.state = {
      username: props.username,
      videoConstraints: {
        width: 640,
        height: 480,
        facingMode: "user",
      },
      waitingForUserAccept: true,
      isRecording: false,
      isLoading: false,
      userDenied: false,
      peerId: false,
      shouldRenderPasswordModal: false,
      loadingFaceDetection: true,
      peerCons: [],
      peerMediaCalls: [],
      movementDetected: false,
      serverError: false,
      countdownActive: false,
      webcams: [],
      sendPush: true,
      faceSens: 0.5,
      movementSens: 290000,
      sendSMS: true,
      streamTitle: null,
      sendEmail: true,
      streamDevices: {},
      devices: [],
      motion: false,
    };
  }
  componentDidMount() {
    this.getDevices();
    this.loadFacialDetection()
      .then(() => {
        this.createWebcamList().then(() => {
          this.setState({ loadingFaceDetection: false });
          let timer = setInterval(this.doFacialDetection, 500);
          this.setState({ timer: timer });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleFaceSensUpdate(sens) {
    if (sens.target.value * 0.01 < 1) {
      this.setState({ faceSens: sens.target.value * 0.01 });
    } else {
      this.setState({ faceSens: 0.999 });
    }
  }

  handleMotionSensUpdate(sens) {
    this.setState({ movementSens: sens.target.value * 3000 + 140000 });
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
        let streamDevices = {};
        result.devices.forEach((device) => {
          streamDevices[device.deviceName] = false;
        });
        console.log("stream info: ", streamDevices);
        this.setState({
          devices: result.devices,
          streamDevices: streamDevices,
        });
        console.log(result.message);
      }
    });
  }

  // Send notifications for logged in user
  addAlert() {
    let req = {
      username: this.props.username,
      peerId: this.state.peerId,
    };
    return fetch(`api/stream/addAlert`, {
      method: "POST",
      body: JSON.stringify(req),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  sendNotifications(options) {
    return fetch(`api/stream/sendnotifications`, {
      method: "POST",
      body: JSON.stringify(options),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Send notifications for logged in user
  sendPushNotifications(options) {
    let newBody = {
      username: this.props.username,
      title: options.title,
      body: options.body,
      leftText: options.leftText,
      rightText: options.rightText,
      url: options.url,
    };
    return fetch(`api/serviceworker/sendnotifications`, {
      method: "POST",
      body: JSON.stringify(newBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  sendSMSnotification(options) {
    let newBody = {
      title: options.title,
      body: options.body,
      url: options.url,
    };
    return fetch(`api/user/SMSalert`, {
      method: "POST",
      body: JSON.stringify(newBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.timer);
  }
  runMotionDetection() {
    let ctx = motionRef.current.getContext("2d");

    let diff = 0;
    let firstPass = true;
    let oldData = [];
    let data = [];
    let thisRef = this;
    (function loop() {
      ctx.drawImage(ref.current.video, 0, 0, 640, 480, 0, 0, 128, 77);
      if (firstPass) {
        oldData = ctx.getImageData(0, 0, 128, 77).data;
        firstPass = false;
      } else {
        data = ctx.getImageData(0, 0, 128, 77).data;
        for (var x = 0; x < 128; x++) {
          for (var y = 0; y < 77; y++) {
            for (var p = 0; p < 4; p++) {
              var i = x + y * 128 * 4 + p;
              let cdiff = Math.abs(oldData[i] - data[i]);
              diff += cdiff;
            }
          }
        }
        oldData = data;
        if (diff > thisRef.state.movementSens) {
          thisRef.setState({ motion: true });
        } else {
          thisRef.setState({ motion: false });
        }
        diff = 0;
      }
      setTimeout(loop, 222);
    })();
  }

  selectWebcam(newCamId) {
    if (
      !this.state.videoConstraints.deviceId ||
      newCamId !== this.state.videoConstraints.deviceId
    ) {
      this.setState({
        videoConstraints: {
          width: 1280,
          height: 720,
          facingMode: "user",
          deviceId: newCamId,
        },
      });
    }
  }
  async createWebcamList() {
    let ref = this;
    if (navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then(function (devices) {
          let cams = devices
            .filter((device) => {
              return device.kind == "videoinput";
            })
            .map((cam) => {
              return { id: cam.deviceId, label: cam.label };
            });
          ref.setState({
            webcams: cams,
            userDenied: devices.length === 0,
          });
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });
    } else {
      this.setState({ userDenied: true });
    }
  }

  async loadFacialDetection() {
    await faceapi.nets.ssdMobilenetv1.load("/models");
  }

  async doFacialDetection() {
    let minConfidence = this.state.faceSens;
    //console.log(ref);
    const result = await faceapi.detectSingleFace(
      ref.current.video,
      new faceapi.SsdMobilenetv1Options({ minConfidence })
    );
    if (result) {
      const dims = faceapi.matchDimensions(
        canvasRef.current,
        ref.current.video,
        true
      );
      if (!this.state.movementDetected) {
        this.setState({ movementDetected: true });
        if (this.state.isRecording) {
          this.addAlert();
          /*
          if (this.state.sendPush) {
            this.sendNotifications({
              title: "Face detected on stream",
              body: "Click Live Watch to view",
              leftText: "Dismiss Notification",
              rightText: "Live Watch",
              url: `/watch/${this.state.peerId}`,
            });
          }
          if (this.state.sendSMS) {
            this.sendSMSnotification({
              title: "Face detected on stream: ",
              body: "watch from here ",
              url: `/watch/${this.state.peerId}`,
            });
          }
          */
        }
      }

      faceapi.draw.drawDetections(
        canvasRef.current,
        faceapi.resizeResults(result, dims)
      );
      this.state.peerCons.forEach((conn) => {
        conn.send({
          event: "movementDetected",
          dims: JSON.stringify(dims),
          faceData: JSON.stringify(result),
        });
      });
    } else {
      // no detection
      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (this.state.movementDetected) {
        this.setState({ movementDetected: false });
      }
    }
  }

  reload() {
    window.location.reload();
  }

  handleStartCam() {
    this.setState({ waitingForUserAccept: false, userDenied: false });
    this.runMotionDetection();
  }

  handleUserDenied() {
    this.setState({ userDenied: true, waitingForUserAccept: false });
  }

  doArmWait(subReq) {
    this.setState({ armCounter: 3, countdownActive: true });
    let armTimer = setInterval(() => {
      let counter = this.state.armCounter;
      counter -= 1;
      console.log(counter);
      if (counter == 0) {
        clearInterval(this.state.armTimer);
        this.setState({ armCounter: 0, isLoading: true });
        this.activateRecording(subReq);
      } else {
        this.setState({ armCounter: counter });
      }
    }, 1000);
    this.setState({ armTimer: armTimer });
  }

  activateRecording(subReq) {
    // start peer stuff
    let peer = new Peer();
    let parent = this;

    let streamDevices = [];
    for (let streamDevice in parent.state.streamDevices) {
      if (parent.state.streamDevices.hasOwnProperty(streamDevice)) {
        if (parent.state.streamDevices[streamDevice]) {
          streamDevices.push(streamDevice);
        }
      }
    }

    peer.on("open", function (id) {
      console.log("My peer ID is: " + id);
      let req = {
        title: subReq.title,
        devices: streamDevices, //// Need this to be based off of checkboxed devices
        peerId: id,
        username: parent.props.username,
        streamingOptions: {
          sms: parent.state.sendSMS,
          push: parent.state.sendPush,
          email: parent.state.sendEmail,
        },
      };
      Requests.startStream(req).then((res) => {
        if (res && res.status && res.status != "200") {
          console.log(res);
          parent.setState({
            isRecording: false,
            peerId: null,
            serverError: true,
            isLoading: false,
            countdownActive: false,
          });
        } else if (res && !res.status) {
          console.log("success");

          parent.setState({
            isRecording: true,
            peerId: id,
            streamTitle: req.title,
            isLoading: false,
            serverError: false,
            countdownActive: false,
          });

          let notificationoptions = {
            username: res.username,
            peerId: id,
            pushoptions: {
              title: "Started a stream: " + res.title,
              body: "Click Live Watch to view",
              leftText: "Dismiss Notification",
              rightText: "Live Watch",
              url: `/watch/${parent.state.peerId}`,
            },
            smsoptions: {
              title: "Started stream - " + res.title + ": ",
              body: "\nWatch from here: ",
              url: `http://localhost:3000/watch/${parent.state.peerId}`,
            },
            emailoptions: {
              subject: "Started a stream: " + res.title,
              content:
                'To watch the stream, click <a href="http://localhost:3000/watch/' +
                parent.state.peerId +
                '">here</a>',
            },
          };
          parent.sendNotifications(notificationoptions);
        }
      });
    });

    peer.on("connection", function (conn) {
      let connPeerId = conn.peer;
      console.log(connPeerId);
      var call = peer.call(connPeerId, ref.current.stream);
      call.on("close", function () {
        console.log(call);
        let currentPeerMediaCalls = parent.state.peerMediaCalls;
        parent.setState({
          peerMediaCalls: currentPeerMediaCalls.filter((acall) => {
            return acall.peer !== call.peer;
          }),
        });
      });

      let currentPeerCons = parent.state.peerCons;
      let currentPeerMediaCalls = parent.state.peerMediaCalls;

      parent.setState({
        peerCons: currentPeerCons.concat(conn),
        peerMediaCalls: currentPeerMediaCalls.concat(call),
      });
      conn.on("close", function () {
        console.log("Dropped connection");
        let currentPeerCons = parent.state.peerCons;
        console.log(conn);
        parent.setState({
          peerCons: currentPeerCons.filter((aconn) => {
            return aconn.peer !== conn.peer;
          }),
        });
      });
      conn.on("data", function (data) {
        // Will print 'hi!'
        if (data.action == "STOP") {
          parent.stopStreaming();
        }
        console.log(data);
      });
    });
  }

  handleToggleRecord(subReq) {
    if (!this.state.isRecording) {
      this.doArmWait(subReq);
    } else {
      // render modal
      this.setState({ shouldRenderPasswordModal: true });
    }
  }

  closeModal() {
    this.setState({ shouldRenderPasswordModal: false });
  }

  stopStreaming() {
    this.setState({ shouldRenderPasswordModal: false });

    this.state.peerCons.forEach((conn) => {
      conn.close();
    });
    this.state.peerMediaCalls.forEach((call) => {
      call.close();
    });

    this.setState({ isRecording: false, peerCons: [], peerMediaCalls: [] });
  }

  takeScreenshot() {
    console.log("taking screenshot");
    if (this.state.streamTitle) {
      fetch("/api/screenshot/create", {
        method: "POST",
        body: JSON.stringify({
          title: this.state.streamTitle,
          data: ref.current.getScreenshot(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        console.log(res);
        if (res && res.status === 200) {
          ToastNotif({
            title: "Took a Screenshot",
            type: "success",
            message:
              "Screenshot can be viewed in the screenshot gallery and will be sent to your email shortly",
          });
        } else {
          ToastNotif({
            title: "Failed to take a Screenshot",
            type: "failure",
            message: "Perhaps you have lost connect to the network",
          });
        }
      });
    }
  }

  selectDevice(deviceName) {
    this.state.streamDevices[deviceName] = !this.state.streamDevices[
      deviceName
    ];
  }

  render() {
    return (
      <FadeIn>
        <Jumbotron className="jumbotron-setup">
          <Container fluid="true" className="main-container">
            <Row>
              <Col xl={2}>
              {!this.state.userDenied &&
                !this.state.waitingForUserAccept &
                  !this.state.loadingFaceDetection ? (
                  <ControlPanel
                    screenShotCallback={this.takeScreenshot}
                    isStreaming={this.state.isRecording}
                    devices={this.state.devices}
                    selectDevice={this.selectDevice}
                    faceSensUpdate={this.handleFaceSensUpdate}
                    motionSensUpdate={this.handleMotionSensUpdate}
                  />
                ) : (
                  ""
                )}
              </Col>
              <Col lg={12} xl={8}>
                <h2>
                  {!this.state.isRecording ? "Setup Your Security Cam" : "LIVE"}
                </h2>
                {this.state.waitingForUserAccept ? (
                  <div className="webcam-spinner">
                    <Spinner
                      animation="border"
                      className="webcam-spinner-text"
                      variant="primary"
                      role="status"
                    >
                      <span className="sr-only"></span>
                    </Spinner>
                    <div className="webcam-spinner-text">
                      Please allow access your Webcam
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {this.state.loadingFaceDetection ? (
                  <div className="webcam-spinner">
                    <div className="webcam-spinner-text">
                      Loading facial detection data...
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {this.state.userDenied ? (
                  <div>
                    <h3>Failed to access webcam</h3>
                    <p>
                      Either you have no attached webcams or you did not allow
                      access to your webcam
                    </p>
                    <div className="webcam-error-button">
                      <Button onClick={this.reload}> Try Again</Button>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="webcam">
                  <Webcam
                    audio={false}
                    ref={ref}
                    className={`webcam-actual ${
                      this.state.motion ? "red-border" : ""
                    }`}
                    screenshotFormat="image/jpeg"
                    videoConstraints={this.state.videoConstraints}
                    width={640}
                    height={480}
                    onUserMedia={this.handleStartCam}
                    onUserMediaError={this.handleUserDenied}
                    screenshotQuality={0.5}
                  />
                  <canvas className="webcam-canvas" ref={canvasRef}></canvas>

                  <canvas
                    id="motionCanvas"
                    className="motion-canvas"
                    ref={motionRef}
                  ></canvas>

                  {this.state.countdownActive ? (
                    <div className="countdownOverlay">
                      <div className="countdownText">
                        {<ReactTextTransition text={this.state.armCounter} />}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {!this.state.userDenied &&
                !this.state.waitingForUserAccept &
                  !this.state.loadingFaceDetection ? (
                  <FadeIn>
                    <div className="stream-form">
                      <h3>Stream Info</h3>
                      <Formik
                        validationSchema={schema}
                        onSubmit={this.handleToggleRecord}
                        initialValues={{
                          title: "",
                          email: true,
                          sms: true,
                          push: true,
                        }}
                      >
                        {({
                          handleSubmit,
                          handleChange,
                          values,
                          touched,
                          errors,
                        }) => (
                          <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group required controlId="formTitle">
                              <Form.Label>Title</Form.Label>
                              <Form.Control
                                required
                                type="text"
                                name="title"
                                placeholder="Living Room 1"
                                value={values.title}
                                onChange={handleChange}
                                disabled={this.state.isRecording}
                                isInvalid={touched.title && !!errors.title}
                              />
                              <Form.Control.Feedback type="invalid">
                                Please specify a title.
                              </Form.Control.Feedback>
                            </Form.Group>
                            <WebcamSelect
                              onSelect={this.selectWebcam}
                              availableDevices={this.state.webcams}
                            />
                            <div className="form-checkmarks">
                              <Form.Group>
                                <Form.Check
                                  onChange={(event) => {
                                    this.setState({
                                      sendEmail: !this.state.sendEmail,
                                    });
                                  }}
                                  type="switch"
                                  name="email"
                                  disabled={this.state.isRecording}
                                  label="Notify with Email"
                                  id="email"
                                  checked={this.state.sendEmail}
                                  isInvalid={touched.email && !!errors.email}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Check
                                  onChange={(event) => {
                                    this.setState({
                                      sendSMS: !this.state.sendSMS,
                                    });
                                  }}
                                  type="switch"
                                  id="sms"
                                  name="sms"
                                  label="Notify with SMS"
                                  checked={this.state.sendSMS}
                                  disabled={this.state.isRecording}
                                  isInvalid={touched.sms && !!errors.sms}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Check
                                  onChange={(event) => {
                                    this.setState({
                                      sendPush: !this.state.sendPush,
                                    });
                                  }}
                                  id="push"
                                  type="switch"
                                  name="push"
                                  label={
                                    this.state.devices.length == 0
                                      ? "You no devices set up"
                                      : "Notify with Push Notification"
                                  }
                                  disabled={
                                    this.state.isRecording ||
                                    this.state.devices.length == 0
                                  }
                                  checked={
                                    this.state.devices.length == 0
                                      ? false
                                      : this.state.sendPush
                                  }
                                  isInvalid={touched.push && !!errors.push}
                                />
                              </Form.Group>
                            </div>
                            <FadeIn>
                              <div className="setup-button">
                                <Button
                                  className="record-button"
                                  disabled={this.state.countdownActive}
                                  type="submit"
                                  variant={
                                    this.state.countdownActive
                                      ? "warning"
                                      : this.state.isRecording
                                      ? "danger"
                                      : "primary"
                                  }
                                >
                                  {this.state.countdownActive
                                    ? "Arming in " + this.state.armCounter
                                    : this.state.isRecording
                                    ? "Disarm"
                                    : "Arm"}
                                  {this.state.isLoading ? (
                                    <Spinner
                                      className={"button-spinner "}
                                      animation="border"
                                      variant="primary"
                                    />
                                  ) : (
                                    ""
                                  )}
                                </Button>
                              </div>
                            </FadeIn>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </FadeIn>
                ) : (
                  ""
                )}
                {this.state.shouldRenderPasswordModal ? (
                  <ModalController
                    username={this.props.username}
                    peerId={this.state.peerId}
                    notify={this.sendNotifications}
                    streamTitle={this.state.streamTitle}
                    callback={this.stopStreaming}
                    callback2={this.closeModal}
                  />
                ) : (
                  ""
                )}
                {this.state.isRecording ? (
                  <FadeIn>
                    <div className="webcam-link">
                      <div className="webcam-link-item">
                        view your webcam live from any device at
                      </div>
                      <Link
                        className="webcam-link-item"
                        to={`/watch/${this.state.peerId}`}
                        target="_blank"
                      >
                        {`${window.location.hostname}/watch/${this.state.peerId}`}
                      </Link>
                    </div>
                  </FadeIn>
                ) : (
                  ""
                )}
              </Col>
              <Col xl={2} lg={12}>
                {!this.state.userDenied &&
                !this.state.waitingForUserAccept &
                  !this.state.loadingFaceDetection ? (
                  <div className="status-readout">
                    <h4 className="status-readout-heading">System Status</h4>

                    <div className="status-readout-content">
                      {this.state.isRecording ? (
                        <div>
                          <div className="status-readout-text">
                            Currently {this.state.peerMediaCalls.length} active
                            viewers watching this stream
                          </div>
                        </div>
                      ) : (
                        <div className="status-readout-text">Not armed</div>
                      )}
                      <div className="status-readout-text">
                        {!this.state.movementDetected ? (
                          <div>No Face Detected</div>
                        ) : (
                          <div> Face has been spotted</div>
                        )}
                        {!this.state.motion ? (
                          <div>No movement Detected</div>
                        ) : (
                          <div>Movement Detected</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </FadeIn>
    );
  }
}

export default SetupWebcam;
