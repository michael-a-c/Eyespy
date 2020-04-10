import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import "./styles.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import Spinner from "react-bootstrap/Spinner";

export default class ScreenshotGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      loaded: false,
      failed: false,
    };
  }

  componentDidMount() {
    fetch("/api/screenshot/list/").then((res) => {
      if (res && res.status === 200) {
        res.json().then((data) => {
          console.log(data);
          this.setState({ images: data, loaded: true });
        });
      } else {
        this.setState({ failed: true, loaded: true });
      }
    });
  }
  render() {
    return (
      <Jumbotron className="jumbotron-dark gallery-view">
        <Container>
          <Row>
            <Col sm={12}>
              <h4>Your Screen Shots</h4>
              {!this.state.failed && this.state.loaded ? (
                this.state.images.length == 0 ? (
                  <div>You do not have any screenshots</div>
                ) : (
                  <Carousel pause={"hover"} interval={30000}>
                    {this.state.images.map((image) => {
                      return (
                        <Carousel.Item key={image.id}>
                          <img
                            className="d-block w-100"
                            src={`/api/screenshot/view/${image.id}`}
                            alt={image.title}
                          />
                          <Carousel.Caption>
                            <h3 className="image-header">{image.title}</h3>
                            <p className="image-subtext">{image.date}</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                      );
                    })}
                  </Carousel>
                )
              ) : !this.state.failed ? (
                <Spinner
                  className="loading-spinner"
                  animation="border"
                  variant="primary"
                />
              ) : (
                <div>Failed to load</div>
              )}
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    );
  }
}
