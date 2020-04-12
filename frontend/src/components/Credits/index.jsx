import React, { Component } from "react";
import ItemContainer from "../ItemContainer";


class Credits extends Component{
    render() {
        return(
            <ItemContainer>
                <h1>Credits Page</h1>
                <h3>Web Development</h3>
                <ul>
                <li> React Redux: <a href="https://react-redux.js.org/api/connect">here </a></li>
                <li> React Bootstrap (many examples used in code): <a href="https://react-bootstrap.github.io/"> here</a> </li>
                <li> React Redux Usage Tutorial: <a href="https://medium.com/backticks-tildes/setting-up-a-redux-project-with-create-react-app-e363ab2329b8"> here</a></li>
                <li> Backend Typescript + Mongoose Setup Guide:  <a href="https://tutorialedge.net/typescript/typescript-mongodb-beginners-tutorial/"> here </a> </li>
                <li> Base64 Image Conversion: <a href="https://github.com/expressjs/multer/issues/216">here</a></li>
                <li> Nodejs Working with Binary Data: <a href="https://stackoverflow.com/questions/43487543/writing-binary-data-using-node-js-fs-writefile-to-create-an-image-file/43488020"> here</a></li>
                <li> Express Backend Setup: <a href="https://www.freecodecamp.org/news/how-to-write-a-production-ready-node-and-express-app-f214f0b17d8c/"> here </a></li>
                </ul>
                <h3>Face Detection</h3>
                <ul>
                <li>Faceapi Libray (Example code from repo also used): <a href="https://github.com/justadudewhohacks/face-api.js" >here </a></li>
                </ul>
                <h3>WebRTC</h3>
                <ul>
                <li>PeerJS: <a href="https://peerjs.com/" > here </a></li>
                </ul>
                <h3>Movement Detection</h3>
                <ul>
                <li>Core Ideas for Motion Detection: <a href="https://github.com/jasonmayes/JS-Motion-Detection/blob/master/js/MotionDetector.js">here </a>(Overall Threshold Algorithm made by us)</li>
                </ul>
                <h3>Service Workers</h3>
                <ul>
                <li>Google push notifications documentation: <a href="https://developers.google.com/web/fundamentals/push-notifications">here</a></li>
                <li>Google Service Worker  documentation: <a href="https://developers.google.com/web/fundamentals/primers/service-workers">here</a></li>

                </ul>
                <h3>SMS Notifications</h3>
                <ul>
                <li>place holder</li>
                <li>place holder</li>
                </ul>
                <h3>Email Notifications</h3>
                <ul>
                <li>place holder</li>
                <li>place holder</li>
                </ul>
                <h3>Miscellaneous</h3>
                <ul>
                <li>Logo Credits to <a href="flaticon.com"> flaticon</a> and <a href="https://www.kissclipart.com/security-camera-clipart-closed-circuit-television-gek0n3/"> Kiss Clip Art</a></li>
                </ul>
                <h1>AND THE GLORIOUS PROFESSOR THIERRY SANS</h1>
            </ItemContainer>
        )
    }
}
export default Credits;