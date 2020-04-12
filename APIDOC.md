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
