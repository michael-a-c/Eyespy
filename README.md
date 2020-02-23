## EyeSpy

### Sean Applebaum (appleb16), Michael Cottow (cottowmi), Max Sun (sunhao17)

### A Description of the Web Application

The goal of this application is to provide a small security system to watch over an area while a user is away. The application will have two main components: A "Monitor" application and a "Notifier" application. The "Monitor" application will run in a web browser and allow the user to configure a webcam which the app will use to detect movement / faces in a room. Upon detecting a potential "security risk" it will call the "Notifier" app. This will be a mobile app that will notify the user with a warning via a push  notification. (May also be a status bar that the user always sees) There will be an account management system and a device pairing system to allow the user to sync their monitoring and receiving devices.  

### A Description of the Key Features that Will be Completed by the Beta Version

Lorem Ipsum.

### A Description of Additional Features that Will be complete by the Final Version

Lorem Ipsum.

### A Description of the Technology that you Will Use


1. React Redux for the desktop web-application.
1. React Native for the mobile-application development.
1. PeerJs For WebRTC streaming of video to devices and instant notifications from device.
1. Most likely Node.js + Express + MongoDB for backend. We will most likely implement a standard HTTP REST API, however if we have time we will look into using GraphQL where needed. 
1. AWS EC2 Instances for deployment.

### A Description of the top 5 Technical Challenges

1. Face detection / Movement detection
1. Figuring out when and how to stream the webcam, and to what device
1. React Native App challenges (IOS / Android) (Sending out notifications) (keeping the app running in the background as a service)
1. Pairing devices (Basically how do we know that a user has registered a device to an account, how do we keep track of that, probably with a MAC Address)
1. WebRTC, streaming a custom video source with PeerJS and whether we need our own Peer Server.

Architecture Diagram: 
![alt text](https://i.imgur.com/epWlGDL.png "Architecture Diagram")

