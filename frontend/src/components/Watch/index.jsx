import React, { Component } from "react";
import ItemContainer from "../ItemContainer";
import Peer from "peerjs";
import Spinner from "react-bootstrap/Spinner";
import ReactPlayer from "react-player";

import "./styles.scss";

class Watch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      badPeer: false,
      goodPeer: false,
      peerStream: null
    };
  }

  componentDidMount() {
    let peer = new Peer();
    let thisRef = this;
    peer.on("open", id => {
      let conn = peer.connect(this.props.match.params.id);
      conn.on("open", function() {
        // here you have conn.id
        conn.send("hi!");
        console.log("CONNECTED");
      });
    });

    peer.on("call", function(call) {
      console.log("GETTING CALLED");
      call.answer();
      call.on("stream", function(remoteStream) {
        // Show stream in some video/canvas element.
        console.log("RECEIVING STREAM");
        thisRef.setState({ loading: false, peerStream: remoteStream });
      });
    });
  }

  render() {
    return (
      <ItemContainer>
        <h1>Live Watch</h1>
        {this.state.loading ? (
          <div className="loading-info">
            <div className="loading-text">Connecting to webcam...</div>
            <Spinner
              className="loading-spinner"
              animation="border"
              variant="primary"
            />
          </div>
        ) : (
          <div className="video-wrapper">
            <ReactPlayer controls={true} url={this.state.peerStream} playing />
          </div>
        )}
      </ItemContainer>
    );
  }
}

export default Watch;
