import React, { Component, useState } from "react";
import "./styles.scss";
import Requests from "../../utils/requests.js";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import PasswordModal from "../PasswordModal";
import Peer from "peerjs";

function Stream(props) {
  const [show, setShow] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  const handleClose = (password) => {
    let req = {
      username:props.username,
      password:password,
      peerId: props.peerId
    }
    Requests.stopStream(req).then((res) => {
      if(res && res.status == "401"){
        setPasswordError("Invalid Password");
        setShow(true);
      } else if(res && res.status) {
        setPasswordError("Server Password");
        setShow(true);
      } else if (res && !res.status) {
        setPasswordError(null);
        setShow(false);
        props.callback();
        // tell the peer to shut down
        let peer = new Peer();
        peer.on("open", function(id) {
          let conn = peer.connect(props.peerId);
          conn.on("open", function() {
            // here you have conn.id
            conn.send({action:"STOP"});
          });
        });
      }
    })
  };

  const handleShow = () => setShow(true);

  return (
    <div className="stream">
      <div className="stream-info">
        <div className="stream-title">{props.device}</div>
        <div className="stream-title">{props.name}</div>
        <div className="stream-started">{props.startTime}</div>
      </div>
      <div className="stream-info-2">
        <div className="stream-alerts "> 0 unacknowledged alerts</div>
        <div className="stream-alerts-total"> 0 total alerts</div>
      </div>
      <div className="stream-buttons">
        <Link
          className="webcam-link-item"
          to={`/watch/${props.peerId}`}
          target="_blank"
        >
          <Button> Watch</Button>
        </Link>

        <Button onClick={handleShow}> Stop</Button>
        <PasswordModal show={show} handleClose={handleClose} error={passwordError}/>
      </div>
    </div>
  );
}

class Streams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      streams: [],
      fetchError: false
    };
    this.getStreams = this.getStreams.bind(this);

  }
  componentDidMount() {
   this.getStreams(); 
  }

  getStreams(){
    Requests.getUserStreams().then(res => {
      if (res && !res.status) {
        this.setState({
          streams: res,
          fetchError: false
        });
      } else {
        this.setState({ fetchError: true });
      }
    });
  }
  render() {
    return (
      <div className="streams-wrapper">
        <h2>Active Streams</h2>
        {this.state.streams.map((stream, i) => {
          console.log(stream);
          return (
            <Stream
              key={i}
              name={stream.title}
              device={stream.device}
              startTime={stream.created_at}
              peerId={stream.peerId}
              username={stream.username}
              callback={this.getStreams}
            />
          );
        })}
        {(this.state.streams.length === 0 ) && (!this.state.fetchError)? <div> No active streams  </div> : ""}

        {this.state.fetchError ? <div> Failure to load streams </div> : ""}
      </div>
    );
  }
}
export default Streams;
