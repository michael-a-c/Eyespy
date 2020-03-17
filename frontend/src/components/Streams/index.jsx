import React, { Component } from "react";
import "./styles.scss";
import Button from "react-bootstrap/Button";

function Stream(props) {
  return (
    <div className="stream">
      <div className="stream-info">
      <div className="stream-title">{props.device}</div>
        <div className="stream-title">{props.name}</div>
        <div className="stream-started">3:24am March 15th 2020 {props.startTime}</div>
      </div>
      <div className="stream-info-2">
        <div className="stream-alerts "> 0 unacknowledged alerts</div>
        <div className="stream-alerts-total"> 0 total alerts</div>
      </div>
      <div className="stream-buttons">
        <Button> Watch</Button>
        <Button> Stop</Button>
      </div>
    </div>
  );
}

class Streams extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="streams-wrapper">
        <h2>Active Streams</h2>
        <Stream name="Living Room" device={"iPhone"} />
        <Stream name="Living Room" device={"iPhone"} />
        <Stream name="Living Room" device={"iPhone"} />
        <Stream name="Living Room" device={"iPhone"} />
        <Stream name="Living Room" device={"iPhone"} />
        <Stream name="Living Room" device={"iPhone"} />
        <Stream name="Living Room" device={"iPhone"} />

      </div>
    );
  }
}
export default Streams;
