import React, { Component, useState } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
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
import PasswordModal from "../PasswordModal";
import "./styles.scss";
import Requests from "../../utils/requests.js";

const { Formik } = require("formik");
const yup = require("yup");
const ref = React.createRef();
const canvasRef = React.createRef();

const schema = yup.object({
  title: yup.string().required("Title is required"),
  sms: yup.bool("Type Error"),
  push: yup.bool("Type Error"),
  public: yup.bool("Type Error")
});
function ModalController(props) {
  const [show, setShow] = useState(true);
  const [passwordError, setPasswordError] = useState(null);

  const handleClose = password => {
    let req = {
      username: props.username,
      password: password,
      peerId: props.peerId
    };
    Requests.stopStream(req).then(res => {
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

    this.state = {
      videoConstraints: {
        width: 1280,
        height: 720,
        facingMode: "user"
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
      serverError: false

    };
  }
  componentDidMount() {
    this.loadFacialDetection()
      .then(() => {
        this.setState({ loadingFaceDetection: false });
        let timer = setInterval(this.doFacialDetection, 5000);
        this.setState({ timer: timer });
      })
      .catch(e => {
        console.log(e);
      });
  }

  // Send notifications for logged in user
  sendNotifications(options) {
    let newBody = {
      username: this.props.username,
      title: options.title,
      body: options.body,
      image: "" //Persons face?
    }
    return fetch(`api/serviceworker/sendnotifications`, {
      method: 'POST',
      body: JSON.stringify(newBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.timer);
  }



  async loadFacialDetection() {
    await faceapi.nets.ssdMobilenetv1.load("/models");
  }

  async doFacialDetection() {
    let minConfidence = 0.5;
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
        console.log("AHHH");
        this.sendNotifications({
          title: "My Le title",
          body: "SPAAAAAAAAAAAMMMMM"
        });
      }

      faceapi.draw.drawDetections(
        canvasRef.current,
        faceapi.resizeResults(result, dims)
      );
      this.state.peerCons.forEach(conn => {
        conn.send({
          event: "movementDetected",
          dims: JSON.stringify(dims),
          faceData: JSON.stringify(result)
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
  }

  handleUserDenied() {
    this.setState({ userDenied: true, waitingForUserAccept: false });
  }

  handleToggleRecord(subReq) {
    if (!this.state.isRecording) {
      // start peer stuff
      let peer = new Peer();
      let parent = this;
      this.setState({ isLoading: true });

      peer.on("open", function(id) {
        console.log("My peer ID is: " + id);
        let req = {
          title: subReq.title,
          device: "placeHolder", // Device that is doing le stream
          peerId: id,
          username: parent.props.username,
          streamingOptions: {
            sms: subReq.sms,
            push: subReq.push,
            publicView: subReq.public
          }
        };
        console.log(req);
        Requests.startStream(req).then(res => {
          if (res && res.status && res.status != "200") {
            console.log(res);
            parent.setState({
              isRecording: false,
              peerId: null,
              serverError: true,
              isLoading: false
            });
          } else if (res && !res.status) {
            console.log("success");

            parent.setState({
              isRecording: true,
              peerId: id,
              isLoading: false,
              serverError: false
            });

            /**
             * Sean Put Stuff Here
             * Send Start monitoring notification
             * (Simple Backend Request)
             */
          }
        });
      });

      peer.on("connection", function(conn) {
        let connPeerId = conn.peer;
        console.log(connPeerId);
        var call = peer.call(connPeerId, ref.current.stream);
        let currentPeerCons = parent.state.peerCons;
        let currentPeerMediaCalls = parent.state.peerMediaCalls;

        parent.setState({
          peerCons: currentPeerCons.concat(conn),
          peerMediaCalls: currentPeerMediaCalls.concat(call)
        });

        conn.on("data", function(data) {
          // Will print 'hi!'
          if (data.action == "STOP") {
            parent.stopStreaming();
          }
          console.log(data);
        });
      });
    } else {
      // render modal
      this.setState({ shouldRenderPasswordModal: true });
    }
  }
  stopStreaming() {
    this.setState({ shouldRenderPasswordModal: false });

    this.state.peerCons.forEach(conn => {
      conn.close();
    });
    this.state.peerMediaCalls.forEach(call => {
      call.close();
    });

    this.setState({ isRecording: false, peerCons: [], peerMediaCalls: [] });

    /**
     * Sean Put Stuff Here
     * Send Stop monitoring notification
     * (Simple Backend Request)
     */
  }
  render() {
    return (
      <FadeIn>
        <Jumbotron className="jumbotron-dark jumbotron-setup">
          <Container>
            <Row>
              <Col xs={0}></Col>
              <Col sm={12} lg={9}>
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
                    className="webcam-actual"
                    screenshotFormat="image/jpeg"
                    width={100 + "%"}
                    height={100 + "%"}
                    videoConstraints={this.state.videoConstraints}
                    onUserMedia={this.handleStartCam}
                    onUserMediaError={this.handleUserDenied}
                  />
                  <canvas className="webcam-canvas" ref={canvasRef}></canvas>
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
                          public: true,
                          sms: true,
                          push: true
                        }}
                      >
                        {({
                          handleSubmit,
                          handleChange,
                          values,
                          touched,
                          errors
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
                            <div className="form-checkmarks">
                              <Form.Group>
                                <Form.Check
                                  onChange={handleChange}
                                  type="switch"
                                  name="public"
                                  disabled={this.state.isRecording}
                                  label="Public"
                                  id="public"
                                  checked={values.public}
                                  isInvalid={touched.public && !!errors.public}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Check
                                  onChange={handleChange}
                                  type="switch"
                                  id="sms"
                                  name="sms"
                                  label="Notify with SMS"
                                  checked={values.sms}
                                  disabled={this.state.isRecording}
                                  isInvalid={touched.sms && !!errors.sms}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Check
                                  onChange={handleChange}
                                  id="push"
                                  type="switch"
                                  name="push"
                                  label="Notify with Push Notification"
                                  disabled={this.state.isRecording}
                                  checked={values.push}
                                  isInvalid={touched.push && !!errors.push}
                                />
                              </Form.Group>
                            </div>
                            <FadeIn>
                              <div className="setup-button">
                                <Button
                                  className="record-button"
                                  type="submit"
                                  variant={
                                    !this.state.isRecording
                                      ? "primary"
                                      : "danger"
                                  }
                                >
                                  {!this.state.isRecording
                                    ? "Arm System"
                                    : "Disarm System "}
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
                    callback={this.stopStreaming}
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
              <Col lg={3} sm={12}>
                {!this.state.userDenied &&
                !this.state.waitingForUserAccept &
                  !this.state.loadingFaceDetection ? (
                  <div className="status-readout">
                    <div className="status-readout-heading">SYSTEM STATUS</div>

                    <div className="status-readout-content">
                      {this.state.isRecording ? (
                        <div>
                          <div className="status-readout-text">
                            Currently {this.state.peerMediaCalls.length} active
                            viewers watching this stream
                          </div>
                          <div className="status-readout-text">
                            {!this.state.movementDetected
                              ? "No movement detected"
                              : " Movement in the system has been spotted"}
                          </div>
                        </div>
                      ) : (
                        <div className="status-readout-text">Not armed</div>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Col>
              <Col xs={0}></Col>
            </Row>
          </Container>
        </Jumbotron>
      </FadeIn>
    );
  }
}

export default SetupWebcam;
