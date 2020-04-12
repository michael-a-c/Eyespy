# API DOCUMENTATION

## Service Workers

## Send Notification


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
    image: string;
    leftText: string;
    rightText: string;
    url: string;
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
 ``` curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"subscription":{"endpoint":"ABCDEFG", "expirationTime":"2020-04-02", "keys": {"p256dh":"publicKey123", "auth":"authKey123"}, },"title":"Notification Title", "body":"Notification Body", "image":"imageName.jpg", "leftText":"Left option", "rightText":"Right option", "url":"https://eyespy.me/watch/id}' \
  http://localhost:3000/api/serviceworker/sendnotification``` 


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
 ``` curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"xyz","password":"xyz", "email":"some@email.com", "phone": 55552900}' \
  http://localhost:3000/api/users/signup``` 




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
 - 200
   - Content-Type: JSON
   - Body: 
 ```
    {
        username: string
    }

 ```

 - Example 
 ``` curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"xyz","password":"xyz", "email":"some@email.com", "phone": 55552900}' \
  http://localhost:3000/api/users/signup``` 


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
 ``` curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"xyz","password":"xyz", "email":"some@email.com", "phone": 55552900}' \
  http://localhost:3000/api/users/signup``` 
