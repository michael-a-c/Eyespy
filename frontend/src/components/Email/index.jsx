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

let emailjs = require('emailjs')

export class Email extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    sendEmail() {
        console.log("sending email")
        var email = require('emailjs');

        var server = email.server.connect({
            user: 'nodejsiscool@gmail.com',
            password: 'stackoverflow',
            host: 'smtp.gmail.com',
            ssl: true
        });
        /*
        server.send({
            text: 'Hey howdy',
            from: 'NodeJS',
            to: 'Wilson <wilson.balderrama@gmail.com>',
            cc: '',
            subject: 'Greetings'
        }, function (err, message) {
            console.log(err || message);
        });*/

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
