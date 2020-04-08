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

let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'eyespy978@gmail.com',
        pass: 'snowden123'
    }
});

export class Email extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    sendEmail() {
        console.log("sending email")
        var mailOptions = {
            from: 'eyespy978@gmail.com',
            to: 'seanapplebaum@gmail.com',
            subject: 'Security Breach',
            text: 'Hi Sean,\n We have detected a security breach on your stream.\n Please click here to see the breach: *link here*'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
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
