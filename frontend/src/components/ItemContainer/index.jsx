import React, { Component } from "react";
import "./styles.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FadeIn from "react-fade-in";

class ItemContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <FadeIn>
        <Container>
          <Row>
            <Col></Col>
            <Col xs={12} md={9}>
              <div className="item-container-wrapper">
                {this.props.xd}
                {this.props.children}
              </div>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </FadeIn>
    );
  }
}

export default ItemContainer;
