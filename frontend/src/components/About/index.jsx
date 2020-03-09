import React, { Component } from 'react';
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Figure from "react-bootstrap/Figure";
import ItemContainer from "../ItemContainer";
import Applebaum from "../../Applebaum.png";
import Cottow from "../../Cottow.png";
import logo from "../../logo192.png";
/*import { setUser } from "../../utils/redux/actions";
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';*/

import './styles.scss';

export class About extends Component {
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
                                    Registered terrorist on several nations no fly list, this individual decided to leave a life of offensive terrorism for a more subtle approach.
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
                                    Ukrainian war criminal on the run for several years, he has emerged from hiding in his rural safehouse in Newfoundland to once again fight for the people.
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
                                    src={logo}
                                />
                                <Figure.Caption>
                                    L33t h4xor who is notorious for breaching the security at his local Banana Republic to obtain a storewide 30% discount and bonus reward points. Much wow.
                                </Figure.Caption>
                            </Figure>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <div className="flex-plz-button">
                    <Button variant="danger">DO NOT PRESS</Button>
                </div>
                <p className="disclaim">*DISCLAIMER: none of the above information is true, this is all in good fun</p>
            </ItemContainer>
        )
    }
}

export default About;
