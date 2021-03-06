
class SignupRequest {
    username: string;
    password: string;
    email: string;
    phone: string;

    constructor(username: string, password: string, email: string, phone: string) {
        if (!username || !password || !email) throw new Error("INVALID REQUEST BODY")
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
    };
}

class SignupRequestMaker {
    static create(input: SignupRequest) {
        return new SignupRequest(input.username, input.password, input.email, input.phone);
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
    devices: any;
    title:string;

    constructor(username:string, peerId: string, devices: any, title: string, streamingOptions: StreamingOptions){
        this.username = username;
        this.streamingOptions = streamingOptions;
        this.peerId = peerId;
        this.devices = devices;
        this.title = title;
    }
}
class StartStreamingRequestMaker {
    static create(input: StartStreamingRequest) {
        if((input.streamingOptions.publicView === null) || (input.streamingOptions.push === null)  || (input.streamingOptions.sms === null) ){
            throw new Error("INVALID REQUEST BODY");
        }
        return new StartStreamingRequest(input.username, input.peerId,  input.devices, input.title, input.streamingOptions);
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

class DeviceAdditionRequest {
    username: string;
    deviceName: string;
    subscription: any;
    isRecording: boolean;
    isReceivingNotifications: boolean;

    constructor(username: string, deviceName: string, subscription: any, isRecording: boolean, isReceivingNotifications: boolean) {
        if (!username || !deviceName) throw new Error("INVALID REQUEST BODY")
        this.username = username;
        this.deviceName = deviceName;
        this.subscription = subscription;
        this.isRecording = isRecording;
        this.isReceivingNotifications = isReceivingNotifications
    };
}

class DeviceAdditionRequestMaker {
    static create(input: DeviceAdditionRequest) {
        return new DeviceAdditionRequest(input.username, input.deviceName, input.subscription, input.isRecording, input.isReceivingNotifications);
    }
}

class CreateScreenshotRequestMaker {
    static create(username: string, title:string, data:string) {
        return new CreateScreenshotRequest(username, title, data);
    }
}


class CreateScreenshotRequest{
    username: string;
    title: string;
    data: string;
    constructor(username:string, title: string, data:string){
        if(!username || !title || !data) throw new Error ("INVALID REQUEST BODY");
        this.username = username;
        this.title = title;
        this.data = data;
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
    StopStreamingRequestMaker,
    DeviceAdditionRequest,
    DeviceAdditionRequestMaker,
    CreateScreenshotRequest,
    CreateScreenshotRequestMaker

 }