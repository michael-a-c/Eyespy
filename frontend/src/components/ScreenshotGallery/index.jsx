import React, { Component, useState } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import "./styles.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Requests from "../../utils/requests.js";
import { serializeWithBufferAndIndex } from "bson";


function CarouselController(props) {
  const [index, setIndex] = useState(0);
  
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  }

  const temp = (e) =>{
    console.log(index);
    props.handleDelete(index);
    if(index === props.images.length - 1){
      setIndex(index - 1);
    }
    console.log(index);
  }

  return (
    <Container>
      <Carousel pause={"hover"} interval={null} activeIndex={index} onSelect={handleSelect}>
        {props.images.map((image) => {
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
      <Button variant="danger" onClick={temp}>Delete</Button>
    </Container>
  )
}


export default class ScreenshotGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      loaded: false,
      failed: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.getImages = this.getImages.bind(this);
  }

  componentDidMount() {
    this.getImages();
  }

  getImages(){
    fetch("/api/screenshot/list/").then((res) => {
      if (res && res.status === 200) {
        res.json().then((data) => {
          this.setState({ images: data, loaded: true });
        });
      } else {
        this.setState({ failed: true, loaded: true });
      }
    });
  }

  handleDelete(idx){
    console.log(this.state.images[idx]);
    let req = {imageId: this.state.images[idx].id}
    Requests.removeSS(req).then((res => {
      this.state.images.splice(idx, 1);
      this.setState({images: this.state.images});
    }));
  }

  render() {
    return (
      <Jumbotron className="jumbotron-dark gallery-view">
        <Container>
          <Row>
            <Col sm={12}>
              <h4>Your Screen Shots</h4>
              {!this.state.failed && this.state.loaded ? (
                this.state.images.length === 0 ? (
                  <div>You do not have any screenshots</div>
                ) : (
                    <CarouselController
                      images={this.state.images}
                      handleDelete={this.handleDelete}
                    />
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
