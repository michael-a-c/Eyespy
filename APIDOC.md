# API DOCUMENTATION


## Users

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


### Sign in
  Signs user in
- POST /api/users/signin
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
 - 401 Unauthorized - Bad Password
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
  --data '{"username":"xyz","password":"xyz"}' \
  http://localhost:3000/api/users/signin
``` 

### Update User Info
  Updates user's info
- PUT /api/users/updateInfo
- content-type :application/json
- body:
```
{
    password: string;
    infoType: "email" | "phone";
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
        "message": "Phone Updated" | "Email Updated"
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
- content-type :application/json
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
