# API DOCUMENTATION

## Streams

### List
  List a users streams
- GET /api/stream/list

Responses: 
 - 401 Unauthorized
 - 500 Internal Server Error
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    [{
        username: string,
        devices: any,
        peerId: string,
        title: string,
        alerts: number,
        lastRefresh: Date,
        streamingOptions: {
            sms: boolean,
            push: boolean,
            email: boolean
        }
    }]

 ```

 - Example 

 ``` 
 curl http://localhost:3000/api/stream/list
``` 


## Email

### Send Email Notification

Sends an Email notification to an email from eyespy978@gmail.com with optional image attachment
- POST /api/email/sendemail
- content-type :application/json
- body:
```
{
    email: string;
    subject: string;
    content: string;
    imagePath: string; (optional)
}
```
Responses: 
 - 500 Internal Server Error
    - Content-Type: JSON
   - Body: 
 ```
    {
        message: string
    }

 ```
 - 400 Bad Request
    - Content-Type: JSON
   - Body: 
 ```
    {
        message: string
    }

 ```
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    {
        message: string
    }

 ```

 - Example 
 ``` 
 curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"myrealemail@mail.com", "subject":"Email Subject", "content":"<div>Email content</div>", "imagePath":"image.jpg"}' \
  http://localhost:3000/api/email/sendemail
``` 

## Service Workers

### Send Notification


Sends a push notification to a device
- POST /api/serviceworker/sendnotification
- content-type :application/json
- body:
```
{
    subscription: {
      endpoint: string,
      expirationTime: date,
      keys: {
        p256dh: string,
        auth: string
      }
    }
    title: string;
    body: string;
    image: string; (optional)
    leftText: string; (optional)
    rightText: string; (optional)
    url: string; (optional)
}
```
Responses: 
 - 500 Internal Server Error
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    {
        success: boolean
    }

 ```

 - Example 
 ``` 
 curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"subscription":{"endpoint":"ABCDEFG", "expirationTime":"2020-04-02", "keys": {"p256dh":"publicKey123", "auth":"authKey123"}, },"title":"Notification Title", "body":"Notification Body", "image":"imageName.jpg", "leftText":"Left option", "rightText":"Right option", "url":"https://eyespy.me/watch/id}' \
  http://localhost:3000/api/serviceworker/sendnotification
``` 

## Users

### Sign in
  Signs user in
- POST /api/users/singin
- content-type :application/json
- body:
```
{
    username: string;
    password: string;

}
```
Responses: 
 - 404 Not Found - No Such User Exists
 - 500 Internal Server Error
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    {
        username: string
    }

 ```

 - Example 

 ``` 
 curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"xyz","password":"xyz", "email":"some@email.com", "phone": 55552900}' \
  http://localhost:3000/api/users/signup
``` 


### Signup
Creates a new user
- POST /api/users/signup
- content-type :application/json
- body:
```
{
    username: string;
    password: string;
    email: string;
    phone: string;
}
```
Responses: 
 - 409 Conflict - User Exists
 - 500 Internal Server Error
 - 400 Bad Request - Invalid Body
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    {
        username: string
    }

 ```

 - Example 
 ```
  curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"xyz","password":"xyz", "email":"some@email.com", "phone": 55552900}' \
  http://localhost:3000/api/users/signup
``` 

### Update User Info
  Updates user's info
- PUT /api/users/updateInfo
- content-type :application/json
- body:
```
{
    password: string;
    infoType: "email" | "phone" | "password";
    newInfo: string;
}
```
Responses: 
 - 500 Internal Server Error
 - 401 Unauthorized - Bad Password
 - 400 Bad Request - Not Logged In
 - 400 Bad Request - Invalid Body
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    {
        "message": "Phone Updated" | "Email Updated" | "Password Updated"
    }

 ```

 - Example 
 ``` 
 curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"infoType":"phone", newInfo:"123123123","password":"xyz"}' \
  http://localhost:3000/api/users/updateInfo
``` 

### Add New Device
  Adds a new push-notification device for a user
- PUT /api/users/add-new-device
- content-type: application/json
- body:
```
{
    username: string;
    deviceName: string;
    subscription: serviceWorkerObject;
    isRecording: boolean;
    isReceivingNotifications: boolean;
}
```
Responses: 
 - 500 Internal Server Error
 - 404 Not Found - User not Found
 - 400 Bad Request - Invalid Body
 - 409 Conflict - Already such a device
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    { 
        "message": "Device saved to database" 
    }

 ```

 - Example 
 ``` 
 curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"username":"eeee", deviceName:"myIphone","subscription":{....ServiceWorkerDetails}, "isRecording": "false", "isReceivingNotifications": "true" }' \
  http://localhost:3000/api/users/add-new-device
``` 

### Signout
  Signs active user out of session
- GET /api/users/signout

Responses: 
 - 400 Bad Request - Not Logged In
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    { 
        "message": "signed out" 
    }

 ```

 - Example 

 ``` 
 curl   http://localhost:3000/api/users/signout
``` 


### Remove Device
  Removes a push notification device for a user
- PUT /api/users/remove-device
- content-type :application/json
- body:
```
{
    username: string;
    deviceName: string;
}
```
Responses: 
 - 500 Internal Server Error
 - 404 Not Found - No such device
 - 400 Bad Request - Invalid Body | Not Logged In
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    { 
        "message": "Successfully removed the device"
    }

 ```

 - Example 
 ``` 
 curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"deviceName":"myIphone"}' \
  http://localhost:3000/api/users/add-new-device
``` 


### Get Info
Get User information
- Get /api/users/info

Responses: 
 - 400  Not Logged In 
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    { 
        email | string
        phone | string
        username  | string
    }

 ```

 - Example 
 ``` 
 curl  http://localhost:3000/api/users/info
``` 


### SMS Alert
  Sends SMS Alert for user's phonenumber
- POST /api/users/SMSalert
- content-type :application/json
- body:
```
{
    title: string;
    body: string;
    url: string;

}
```
Responses: 
 - 500 Internal Server Error
 - 401 Unauthorized - Not Logged In
 - 400 Bad Request - Invalid Body
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    {
        "message": "sent SMS: " + fullSMS, "number": userPhonenumber
    }

 ```

 - Example 
 ``` 
 curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"title":"xyz","body":"xyz", "url" :"adfg"}' \
  http://localhost:3000/api/users/SMSalert
``` 


##Screenshots

### Create

  Creates a new screenshot
  - POST /api/screenshot/create
  - content-type: application/json
  - body:
```
{
    title: string;
    data: base64 string;
}
```
Responses:
  - 500 Internal Server Error
  - 401 Unauthorized - not logged in
  - 400 Bad Request - Invalid Body
  - 200
    - Content-Type: JSON
    - Body:
  ```
  {
    id: string;
    path: string;
  }
  ```

  - Example
  ```
  curl --header "Content-Type: application/json" \
  --request POST \
  --data '{title: "streamName", data: "base64string"}' \
  http://localhost:3000/api/screenshot/create
  ```

### View

  View a certain image based on imageId
  - GET /api/screenshot/view/:id

Responses:
  - 500 Internal Server
  - 404 Not Found - image not found
  - 200
    - Content-Type: Binary Data
    - Body:
  ```
  Image File
  ```

  - Example
  ```
  curl http://localhost:3000/api/screenshot/view/0395u0
  ```

### List

  Get all images for a given user
  - GET /api/screenshot/list/

Responses:
  - 500 Internal Server
  - 401 Unauthorized - not signed in
  - 200
    - Content-Type: JSON
    - Body:
    ```
    [
      {
        id: string;
        title: string;
        date: Date;
      }
    ]
    ```

  - Example
  ```
  curl http://localhost:3000/api/screenshot/list/
  ```

### Delete Screenshot

  Delete an image from database based on imageId
  - DELETE /api/screenshot/removeSS
  - content-type: application/json
  - body:
```
{
  imageId: string
}
```

Responses:
  - 401 Unauthorized - not logged in
  - 200
    - Content-Type: JSON
    - Body:
    ```
    {
      message: string
    }
    ```
  
  - Example
  ```
  curl --header "Content-Type: application/json" \
  --request DELETE \
  --data '{imageId: "jafiafi64387yt87gyaoygt9qa8g"}' \
  http://localhost:3000/api/screenshot/removeSS
  ```
