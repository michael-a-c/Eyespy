class SignupRequest{
    constructor(public username: string, public password: string, public email: string){};
}

class SignupRequestMaker{
    static create(input: SignupRequest){
        return new SignupRequest(input.username, input.password, input.email);
    }
}

class SigninRequest{
    constructor(public username: string, public password: string){};
}

class SigninRequestMaker{
    static create(input: SigninRequest){
        return new SigninRequest(input.username, input.password);
    }
}

export default {SignupRequest, SignupRequestMaker, SigninRequest, SigninRequestMaker}