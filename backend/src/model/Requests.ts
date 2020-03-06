
class SignupRequest {
    username: string;
    password: string;
    email: string;

    constructor(username: string, password: string, email: string) {
        if (!username || !password || !email) throw new Error("INVALID REQUEST BODY")
        this.username = username;
        this.password = password;
        this.email = email;
    };
}

class SignupRequestMaker {
    static create(input: SignupRequest) {
        return new SignupRequest(input.username, input.password, input.email);
    }
}

class SigninRequest {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        if (!username || !password) throw new Error("INVALID REQUEST BODY")
        this.username = username;
        this.password = password;
    };
}

class SigninRequestMaker {
    static create(input: SigninRequest) {
        return new SigninRequest(input.username, input.password);
    }
}

class UpdateUserRequest{
    username: string;
    password: string;
    email: string;

    constructor(username: string, password: string, email: string) {
        this.username = username;
        this.password = password;
        this.email = email;
    };
}

export {
    SignupRequest,
    SignupRequestMaker,
    SigninRequest,
    SigninRequestMaker,
    UpdateUserRequest
 }