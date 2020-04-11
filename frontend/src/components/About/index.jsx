import React, { Component } from 'react';
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Figure from "react-bootstrap/Figure";
import Modal from "react-bootstrap/Modal";
import ItemContainer from "../ItemContainer";
import TermsAndConditions from "../TermsAndConditions";
import PrivacyPolicy from '../PrivacyPolicy';
import Applebaum from "../../Applebaum.png";
import Cottow from "../../Cottow.png";
import Sun from "../../Sun.png";
import './styles.scss';



class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            TaC: false,
            PP: false
        }
        this.handleSMS = this.handleSMS.bind(this);
        this.toggleTerms = this.toggleTerms.bind(this);
        this.togglePPolicy = this.togglePPolicy.bind(this);
      }

    toggleTerms() {
        this.setState({ TaC: !this.state.TaC })
    }

    togglePPolicy() {
        this.setState({ PP: !this.state.PP })
    }

    handleSMS(SMSreq) {
        let newBody = {
            title: "WHY YOU PRESS: ",
            body: " it says DO NOT PRESS ",
            url: "/about"
        }
        return fetch(`api/user/SMSalert`, {
            method: 'POST',
            body: JSON.stringify(newBody),
            headers: {
              'Content-Type': 'application/json'
            }
        })
    } 

    render() {
        return (
            <ItemContainer>
                <h1>About the Developers</h1>
                <p>Meet the minds behind this amazing product</p>
                <Accordion className="polka">
                    <Card className="spades">
                        <Accordion.Toggle as={Card.Header} eventKey="0" className="accord-honda">
                            Sean "NoFly" Applebaum
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Figure className="mugshot">
                                <Figure.Image
                                    width={200}
                                    height={200}
                                    src={Applebaum}
                                />
                                <Figure.Caption>
                                    On several nations no fly list, this individual decided to leave a life of heinous misdeads for a more subtle approach.
                                </Figure.Caption>
                            </Figure>
                        </Accordion.Collapse>
                    </Card>
                    <Card className="spades">
                        <Accordion.Toggle as={Card.Header} eventKey="1" className="accord-honda">
                            Michael "ZapEm" Cottow
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Figure className="mugshot">
                                <Figure.Image
                                    width={200}
                                    max-height={200}
                                    src={Cottow}
                                />
                                <Figure.Caption>
                                    On the run for several years, he has emerged from hiding in his rural safehouse in Newfoundland to once again fight for the people.
                                </Figure.Caption>
                            </Figure>
                        </Accordion.Collapse>
                    </Card>
                    <Card className="spades">
                        <Accordion.Toggle as={Card.Header} eventKey="2" className="accord-honda">
                            Max (Hao Ran Sun (Max (Hao Ran Sun())))
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="2">
                            <Figure className="mugshot">
                                <Figure.Image
                                    width={200}
                                    max-height={200}
                                    src={Sun}
                                />
                                <Figure.Caption>
                                    L33t h4xor who is notorious for breaching the security at his local Banana Republic to obtain a storewide 30% discount and bonus reward points. Much wow.
                                </Figure.Caption>
                            </Figure>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <p className="disclaim">*DISCLAIMER: none of the above information is true, this is all in good fun</p>
                <h1>Dcouments to Read</h1>
                <div>
                    <Button variant="link" onClick={this.toggleTerms}>Terms and Conditions</Button>
                </div>
                <div>
                    <Button variant="link" onClick={this.togglePPolicy}>Privacy Policy</Button>
                </div>
                <div>
                    <Button variant="link">Credits</Button>
                </div>
                <div className="flex-plz-button">
                    <Button variant="danger" onClick={this.handleSMS}>DO NOT PRESS</Button>
                </div>
                <Modal size="lg" show={this.state.TaC} onHide={this.toggleTerms}>
                    <Modal.Header closeButton>Terms and Conditions</Modal.Header>
                    <Modal.Body>
                        <TermsAndConditions/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.toggleTerms}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal size="lg" show={this.state.PP} onHide={this.togglePPolicy}>
                    <Modal.Header closeButton>Privacy</Modal.Header>
                    <Modal.Body>
                        <PrivacyPolicy/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.togglePPolicy}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ItemContainer>
        )
    }
}

export default About;
