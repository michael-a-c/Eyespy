// https://medium.com/create-a-server-with-nodemon-express-typescript/create-a-server-with-nodemon-express-typescript-f7c88fb5ee71 typescript setup
// https://levelup.gitconnected.com/setup-express-with-typescript-in-3-easy-steps-484772062e01

import { Stream, IStream } from "./repository";

import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as Express from 'express';
import * as ExpressSession from 'express-session';
const schedule = require('node-schedule');

require('dotenv').config()

const path = require('path');
const root = path.join(__dirname, '../frontend', 'build')

class EyeSpyServer extends Server {
    private readonly SERVER_STARTED = 'Example server started on port: ';

    constructor() {
        super(true);

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(Express.static('static'));
        this.app.use(Express.static(path.join(__dirname, '../frontend/build')));
        let sessionSecret : any = process.env.sessionSecret;

        this.app.use(ExpressSession({
            secret: sessionSecret,
            resave: true,
            saveUninitialized: true,
        }));

        this.setupControllers();
    }

    private setupControllers(): void {
        const ctlrInstances = [];
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) {
                const controller = (controllers as any)[name];
                ctlrInstances.push(new controller());
            }
        }
        super.addControllers(ctlrInstances);
    }

    public start(port: number): void {
        this.app.get('*', (req, res) => {
            res.sendFile('index.html', {root});
        });
        this.app.listen(port, () => {
            Logger.Imp(this.SERVER_STARTED + port);
        });
    }
}


const exampleServer = new EyeSpyServer();
let envPort = process.env.PORT;
let port = parseInt((envPort) || "3001");
exampleServer.start(port);


// setup cleanup jobs

var streamCleanupJob = schedule.scheduleJob(' */1 * * * *', function(){
    console.log("Performing dead stream clean up...");
    let cTime = new Date();
    let timeout = 1; // Every 1 minute should be refreshed
    Stream.find(({}), (err, ress :IStream[]) => {
        if(err) {console.log("Failed to find streams");}
        else{
            ress.forEach((stream:IStream) => {
                let refreshTimePlusTimeout = new Date(
                    stream.lastRefresh.getTime() +
                    timeout * 60000
                );

                if((cTime.getTime() - refreshTimePlusTimeout.getTime()) > 0){
                    console.log("Found Dead Strea ==> "+ stream.title);
                    Stream.findOneAndDelete({ username: stream.username, peerId: stream.peerId }, (err: any, dbRes: any) => {
                        if (err) {   
                            console.log("Failed to remove dead stream : "+ stream.title)
                        } else{
                            console.log("Pruned dead stream");
                        }
                    });           
                }
            })
        }
    })
});