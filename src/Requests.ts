
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

class StreamingOptions{
    publicView:boolean;
    sms:boolean;
    push:boolean;

    constructor(publicView: boolean, sms: boolean, push: boolean) {
        console.log("here");
        if (!publicView || !sms || !push) throw new Error("INVALID REQUEST BODY")
        this.publicView = publicView;
        this.sms = sms;
        this.push = push;
    };
}

class StartStreamingRequest{
    username : string;
    peerId: string;
    streamingOptions : StreamingOptions;
    device: string;
    title:string;

    constructor(username:string, peerId: string, device: string, title: string, streamingOptions: StreamingOptions){
        this.username = username;
        this.streamingOptions = streamingOptions;
        this.peerId = peerId;
        this.device = device;
        this.title = title;
    }
}
class StartStreamingRequestMaker {
    static create(input: StartStreamingRequest) {
        if((input.streamingOptions.publicView === null) || (input.streamingOptions.push === null)  || (input.streamingOptions.sms === null) ){
            throw new Error("INVALID REQUEST BODY");
        }
        return new StartStreamingRequest(input.username, input.peerId,  input.device, input.title, input.streamingOptions);
    }
}

class StopStreamingRequest{
    username : string;
    peerId: string;
    password: string;

    constructor(username:string, peerId: string, password: string){
        this.username = username;
        this.peerId = peerId;
        this.password = password;
    }
}

class StopStreamingRequestMaker {
    static create(input: StopStreamingRequest) {
        if(!input.username || !input.peerId || !input.password ){
            throw new Error("INVALID REQUEST BODY");
        }
        return new StopStreamingRequest(input.username, input.peerId, input.password);
    }
}

export {
    SignupRequest,
    SignupRequestMaker,
    SigninRequest,
    SigninRequestMaker,
    UpdateUserRequest,
    StartStreamingRequest,
    StreamingOptions, 
    StartStreamingRequestMaker,
    StopStreamingRequest,
    StopStreamingRequestMaker
 }