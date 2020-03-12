import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import FadeIn from 'react-fade-in';

//https://itnext.io/react-push-notifications-with-hooks-d293d36f4836

const publicVapidKey = 'BKdAf4wZ1P1Lj2eLC56FMAWBggkimcNWsM98Eznu0gBsiRLk_5QA3DwQ2PcumLSpGPHwxTBkhcItxl96vfSUIPI'
const privateVapidKey = 'VTKDYGn12pvy2fHEYuy_GEWenDuQWsCXK9N56tQ5LMY'



function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey)

export class PushNotifications extends Component {
    constructor(props) {
        super(props)

        this.state = {
            triggerPermission: null,
            supported: "null",
            temp: "null"
        };

        this.handleSubscription = this.handleSubscription.bind(this);
        this.handleTriggerAllDevices = this.handleTriggerAllDevices.bind(this);
        this.handleGetPermission = this.handleGetPermission.bind(this);
    };

    componentWillMount() {
        this.handleGetPermission();
    }

    isPushNotificationSupported() {
        this.setState({temp: ("PushManager" in window).toString()})
        return "serviceWorker" in navigator && "PushManager" in window;
    }

    // returns default (no response), denied, or granted 
    async askUserPermission() {
        if (typeof Notification !== 'undefined') {
            return await Notification.requestPermission();
        }
        return;
    }

    sendSubscription(subscription, params) {
        console.log("sendSubscription")
        let newBody = {
            subscription: subscription,
            title: params.title,
            body: params.body
        }
        return fetch(`api/serviceworker/subscribe`, {
          method: 'POST',
          body: JSON.stringify(newBody),
          headers: {
            'Content-Type': 'application/json'
          }
        })
    }

    subscribeUser(title, body) {
        if ('serviceWorker' in navigator) {
          
          navigator.serviceWorker.ready.then((registration) => {
            if (!registration.pushManager) {
              console.log('Push manager unavailable.')
              return
            }
      
            registration.pushManager.getSubscription().then((existedSubscription) => {
              if (existedSubscription === null) {
                console.log('No subscription detected, make a request.')
                registration.pushManager.subscribe({
                  applicationServerKey: convertedVapidKey,
                  userVisibleOnly: true,
                }).then((newSubscription) =>{
                  console.log('New subscription added.')
                  this.sendSubscription(newSubscription, {
                    title: title,
                    body: body,
                })
                }).catch(function(e) {
                  if (Notification.permission !== 'granted') {
                    console.log('Permission was not granted.')
                  } else {
                    console.error('An error ocurred during the subscription process.', e)
                  }
                })
              } else {
                console.log('Existed subscription detected.')
                this.sendSubscription(existedSubscription, {
                    title: title,
                    body: body,
                })
              }
            })
          })
            .catch(function(e) {
              console.error('An error ocurred during Service Worker registration.', e)
            })
        }
    }

    async handleSubscription() {
        console.log("sub");
        if (this.isPushNotificationSupported()) {
            this.setState({supported: "true"})
            console.log("is supported")
        } else {
            this.setState({supported: "false"})
            console.log("is not supported")
        }

    }


    async handleGetPermission() {
        this.askUserPermission().then((result) => {
            if (result == 'granted') {
                console.log("granted");
                this.setState({ triggerPermission: true });
                
            } else if (result == 'denied') {
                console.log("denied");
                this.setState({ triggerPermission: false });
            } else if (result == 'default') {
                console.log("default");
            } else {
                console.log(result);
            }
        })
    }

    async handleTriggerAllDevices() {
        //console.log(this.state.mySub);
        this.subscribeUser("Hello world", "Thanks Nick")

    }


    render() {
        return (
            <FadeIn>
                <Jumbotron className="jumbotron-dark jumbotron-welcome">
                    <h1>EyeSpy</h1>
                    <p>
                        EyeSpy let's test push notifications
                    </p>
                    <Container fluid className="container-welcome" >
                        <FadeIn>
                            <Row noGutters>
                                {!this.state.triggerPermission ?
                                    <Col xs={6} sm={4} md={6} xl={3} className="welcome-button">
                                        {this.state.temp}
                                        <div className="error-text"> Please allow push notifications</div>
                                    </Col> : ""}
                                <Col xs={6} sm={4} md={6} xl={3} className="welcome-button">
                                    <Button variant="primary"
                                        onClick={this.handleTriggerAllDevices}
                                    >
                                        Trigger Devices
                                    </Button>
                                </Col>
                                <Col xs={6} sm={4} md={6} xl={3} className="welcome-button">
                                    <Button variant="primary"
                                        onClick={this.handleSubscription}
                                    >
                                        Subscribe: {this.state.supported}
                                    </Button>
                                </Col>
                            </Row>
                        </FadeIn>
                    </Container>
                </Jumbotron>
            </FadeIn>
        )
    }
}

export default PushNotifications
