import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Streams from "../Streams";
import FadeIn from "react-fade-in";
import { connect } from "react-redux";

import "./styles.scss";
function StartStream(props) {
  return (
    <div className="stream-start">
      <h2>Start A Stream</h2>
      <div>
        To setup a security camera, start here.
        <div>
          <Link
            className="webcam-link-item"
            to={`/record`}
            target="_blank"
          >
            <Button className="stream-start-button"> Start</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <FadeIn>
        <Row>
          <Col xl={this.props.loggedIn ? 9 : 12} xs={12}>
            <Jumbotron className="jumbotron-dark jumbotron-welcome">
              <h1>EyeSpy</h1>
              <p>
                EyeSpy lets you turn any device into a home surveillance system
                and notifies you right on your phone.
              </p>
              <Container fluid className="container-welcome">
                {!this.props.loggedIn ? (
                  <FadeIn>
                    <Row noGutters>
                      <Col
                        xs={6}
                        sm={3}
                        md={2}
                        xl={1}
                        className="welcome-button"
                      >
                        <Link to="/signup">
                          <Button variant="primary">Sign up</Button>
                        </Link>
                      </Col>
                      <Col
                        xs={6}
                        sm={3}
                        md={2}
                        xl={1}
                        className="welcome-button"
                      >
                        <Link to="/login">
                          <Button variant="primary"> Login </Button>
                        </Link>
                      </Col>
                    </Row>
                  </FadeIn>
                ) : (
                  ""
                )}
              </Container>
            </Jumbotron>
            {this.props.loggedIn ? (
              <Row>
                <Col className="stream-start-wrapper">
                  <StartStream />
                </Col>
              </Row>
            ) : (
              ""
            )}
          </Col>
          {this.props.loggedIn ? (
            <Col className="streams-holder" xs={12} xl={3}>
              <Streams username={this.props.username} />{" "}
            </Col>
          ) : (
            ""
          )}
        </Row>
      </FadeIn>
    );
  }
}

const mapStateToProps = newState => {
  return {
    username: newState.username,
    loggedIn: newState.loggedIn
  };
};

export default connect(mapStateToProps)(Welcome);
