import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Peer from "peerjs";
import Spinner from "react-bootstrap/Spinner";
import ReactPlayer from "react-player";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as faceapi from "face-api.js";
import "./styles.scss";
import Container from "react-bootstrap/Container";

const canvasRef = React.createRef();

class Watch extends Component {
  constructor(props) {
    super(props);
    this.runConnect = this.runConnect.bind(this);

    this.state = {
      loading: false,
      badPeer: false,
      goodPeer: false,
      peerStream: null,
      playing: false,
      connectionFailed:false
    };
  }

  runConnect() {
    let thisRef = this;

    this.setState({ loading: true });
    setTimeout(function() {
      let isPlaying = thisRef.state.playing;
      thisRef.setState({connectionFailed: !isPlaying});
    }, 10000);

    let peer = new Peer();
    peer.on("open", (id) => {
      let conn = peer.connect(this.props.match.params.id);
      conn.on("open", function () {
        // here you have conn.id
        conn.send("hi!");
        console.log("CONNECTED");
      });
      conn.on("data", function (data) {
        // here you have conn.id
        //console.log(data);
        if (data.event) {
          if (data.event === "movementDetected" && thisRef.state.playing) {
            let faceData = JSON.parse(data.faceData);
            const dims = JSON.parse(data.dims);
            //console.log(faceData, dims);
            let ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "green";
            let x = (faceData._box._x / dims.width) * canvasRef.current.width;
            let y = (faceData._box._y / dims.height) * canvasRef.current.height;
            let width =
              (faceData._box._width / dims.width) * canvasRef.current.width;
            let height =
              (faceData._box._height / dims.height) * canvasRef.current.height;
            console.log(x, y, width, height);
            ctx.rect(x, y, width, height);
            ctx.stroke();
          }
        }
      });
    });

    peer.on("call", function (call) {
      console.log("GETTING CALLED");
      call.answer();
      call.on("stream", function (remoteStream) {
        // Show stream in some video/canvas element.
        console.log("RECEIVING STREAM");
        thisRef.setState({
          loading: false,
          playing: true,
          peerStream: remoteStream,
        });
      });
    });
  }

  render() {
    return (
      <Jumbotron className="jumbotron-dark">
        <Container>
          <Row>
            <Col>
              <h1>Live Watch</h1>
              {this.state.loading && !this.state.connectionFailed? (
                <div className="loading-info">
                  <div className="loading-text">Connecting to webcam...</div>
                  <Spinner
                    className="loading-spinner"
                    animation="border"
                    variant="primary"
                  />
                </div>
              ) : this.state.playing && !this.state.connectionFailed ? (
                <div className="video">
                  <ReactPlayer
                    className="video-actual"
                    controls={true}
                    url={this.state.peerStream}
                    playing={this.state.playing}
                  />
                  <canvas className="video-canvas" ref={canvasRef}></canvas>
                </div>
              ) : (
                ""
              )}
              {this.state.connectionFailed ? 
              <div>
                Connection to webcam could not be established, perhaps this is an invalid url or the webcam went offline
              </div> : ""}
              <div className="button-wrapper">
                <Button
                  variant = {this.state.connectionFailed ? "danger" : "primary"}
                  disabled={this.state.playing || this.state.loading || this.state.connectionFailed}
                  onClick={this.runConnect}
                >
                  
                  {
                    this.state.connectionFailed 
                    ?  "Connection Failed!"
                    : !this.state.playing && !this.state.loading
                    ? "Connect"
                    : !this.state.playing
                    ? "Connecting"
                    : "Connected"
                  }
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    );
  }
}

export default Watch;
