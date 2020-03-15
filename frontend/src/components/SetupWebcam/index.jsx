import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Webcam from "react-webcam";
import FadeIn from "react-fade-in";
import Spinner from "react-bootstrap/Spinner";
import Peer from "peerjs";
import { Link } from "react-router-dom";
import * as faceapi from "face-api.js";

import "./styles.scss";

const ref = React.createRef();
const canvasRef = React.createRef();

class SetupWebcam extends Component {
  constructor(props) {
    super(props);
    this.reload = this.reload.bind(this);
    this.handleStartCam = this.handleStartCam.bind(this);
    this.handleUserDenied = this.handleUserDenied.bind(this);
    this.handleToggleRecord = this.handleToggleRecord.bind(this);
    this.loadFacialDetection = this.loadFacialDetection.bind(this);
    this.doFacialDetection = this.doFacialDetection.bind(this);

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
      loadingFaceDetection: true,
      peerCons: [],
      peerMediaCalls: [],
      movementDetected: false
    };
  }
  componentDidMount() {
    this.loadFacialDetection()
      .then(() => {
        this.setState({ loadingFaceDetection: false });
        let timer = setInterval(this.doFacialDetection, 500);
        this.setState({ timer: timer });
      })
      .catch(e => {
        console.log(e);
      });
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
      this.setState({movementDetected:true});

      faceapi.draw.drawDetections(
        canvasRef.current,
        faceapi.resizeResults(result, dims)
      );
      this.state.peerCons.forEach((conn) => {
        conn.send({
          "event":"movementDetected",
          "dims": JSON.stringify(dims),
          "faceData":JSON.stringify(result)
        });
      })
    } else {
      // no detection
      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        this.setState({movementDetected:false});
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

  handleToggleRecord() {
    if (!this.state.isRecording) {
      let peer = new Peer();
      let parent = this;
      this.setState({ isLoading: true });

      peer.on("open", function(id) {
        console.log("My peer ID is: " + id);

        parent.setState({
          isRecording: true,
          peerId: id,
          isLoading: false
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
          console.log(data);
        });
      });
    } else {
      this.state.peerCons.forEach(conn => {
        conn.close();
      });
      this.state.peerMediaCalls.forEach(call => {
        call.close();
      });

      this.setState({ isRecording: false, peerCons: [], peerMediaCalls: [] });
    }
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
                {!this.state.userDenied &&
                !this.state.waitingForUserAccept &
                  !this.state.loadingFaceDetection ? (
                  <FadeIn>
                    <div className="setup-button">
                      <Button
                        className={"record-button"}
                        onClick={this.handleToggleRecord}
                        variant={!this.state.isRecording ? "primary" : "danger"}
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

                    <div>
                      {this.state.isRecording ? (
                        <div>
                          <div className="status-readout-text">
                            Currently {this.state.peerMediaCalls.length} active
                          viewers watching this stream
                          </div>
                          <div className="status-readout-text">
                            {!this.state.movementDetected ? "No movement detected" : " Movement in the system has been spotted"}
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
