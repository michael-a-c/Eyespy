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
import Requests from '../../utils/requests.js';

import "./styles.scss";

export class Email extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    sendEmail() {
        // make a be call that sends an email

        let req = {
            name: "name",
            email: "email",
            message: "message"
        }
        Requests.sendemail(req).then((result) => {
            if (result.status === 400) {
              //this.setState({ loading: false, badRequestError: true });
            } else if (result.status === 401) {
              //this.setState({ loading: false, unAuthorizedError: true });
            } else if (result.status === 404) {
              //this.setState({ loading: false, notFoundError: true });
            } else if (result.status === 409) {
              //this.setState({ loading: false, conflictError: true });
            } else if (result.status && result.status !== 200) {
              //this.setState({ loading: false, serverError: true })
            } else {
              console.log(result.message)
            }
            console.log("sent???")
          })
    }

    render() {
        return (

            <FadeIn>
                <Jumbotron className="jumbotron-dark jumbotron-welcome">
                    <h1>EyeSpy</h1>
                    <p>
                        EyeSpy let's do sum emails
                    </p>
                    <Button variant="primary"
                        onClick={this.sendEmail}
                    >
                        Send email to myself
                                    </Button>
                </Jumbotron>
            </FadeIn>
        );
    }
}

export default Email;
