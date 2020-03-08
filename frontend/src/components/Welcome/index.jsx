import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import FadeIn from 'react-fade-in';

import './styles.scss'

export class Welcome extends Component {
  constructor(props) {
    super(props)

    this.state = {

    };
  };
  render() {
    return (
      <FadeIn>
        <Jumbotron className="jumbotron-dark jumbotron-welcome">
          <h1>EyeSpy</h1>
          <p>
            EyeSpy let's you turn any device into a home surveilance system and notifies you right on your phone.
        </p>
          <Container fluid className="container-welcome" >
            {!this.props.loggedIn ? <FadeIn> <Row noGutters>
              <Col xs={6} sm={3} md={2} xl={1} className="welcome-button"><Link to="/signup"><Button variant="primary">Sign up</Button></Link></Col>
              <Col xs={6} sm={3} md={2} xl={1} className="welcome-button"><Link to="/login"><Button variant="primary"> Login </Button></Link></Col>
            </Row></FadeIn>  : ""}
          </Container>
        </Jumbotron>
      </FadeIn>
    )
  }
}

export default Welcome
