import { Response, Request } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { StartStreamingRequest, StartStreamingRequestMaker, StopStreamingRequest, StopStreamingRequestMaker } from '../Requests'
import { Stream, StreamSchema, IStream, User, IUser } from "../repository";
import { NativeError, Schema } from 'mongoose';
import { isAuthenticated } from '../middleware'
const bcrypt = require('bcryptjs');

const twilio = require('twilio')('AC9e52c9c34772601e7260597eabb183cc', '2f63ecb944038ba4413a507babc34b27');
// eyespysnowdenc09

var nodemailer = require('nodemailer');
var fs = require('fs');


var transport = {
    host: 'smtp.gmail.com',
    auth: {
        user: 'eyespy978@gmail.com',
        pass: 'snowden123'
    }
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error: any, success: any) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

@Controller('api/stream')
export class StreamingController {
    @Get('list')
    @Middleware(isAuthenticated)
    private list(req: Request, res: Response) {
        Logger.Info(req.url);
        let username = req.session?.user;
        Stream.find({ username: username }).exec((err: any, dbRes: any) => {
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            } else {
                return res.json(dbRes);
            }
        });
    }
    @Post('stop')
    @Middleware(isAuthenticated)
    private stop(req: Request, res: Response) {
        Logger.Info(req.url);
        let stopStreamingRequest: StopStreamingRequest;
        try {
            stopStreamingRequest = StopStreamingRequestMaker.create(req.body);

        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }
        // 1. Make sure session user id === request user id
        if (req.session?.user !== stopStreamingRequest.username) {
            return res.status(UNAUTHORIZED).json({ "message": "cannot start stream of another user" });
        }
        // 2. Make sure password is correct
        User.find({ username: stopStreamingRequest.username }).exec((err: NativeError, result: IUser[]) => {
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            else if (result.length === 0) {
                return res.status(NOT_FOUND).json({ "message": "user not found" }).end();
            } else {
                bcrypt.compare(stopStreamingRequest.password, result[0].password, function (err: any, valid: boolean) {
                    if (err) return res.status(INTERNAL_SERVER_ERROR).json(err).end();
                    if (!valid) return res.status(UNAUTHORIZED).end();
                    // 3. delete active stream
                    Stream.findOneAndDelete({ username: stopStreamingRequest.username, peerId: stopStreamingRequest.peerId }, (err: any, dbRes: any) => {
                        if (err) return res.status(BAD_REQUEST).json(err).end();

                        if (!dbRes) {
                            return res.status(NOT_FOUND).end("No such stream");
                        }
                        return res.json(dbRes).end();
                    });
                });
            }

        });
    }

    @Post('start')
    @Middleware(isAuthenticated)
    private start(req: Request, res: Response) {
        Logger.Info(req.url);
        let StartStreamingRequest: StartStreamingRequest;
        try {
            StartStreamingRequest = StartStreamingRequestMaker.create(req.body);

        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }

        // make sure session user id === request user id
        if (req.session?.user !== StartStreamingRequest.username) {
            return res.status(UNAUTHORIZED).json({ "message": "cannot start stream of another user" });
        }

        // make sure there's no PeerId with same peerId in request
        Stream.find({ peerId: StartStreamingRequest.peerId }).exec((err: any, dbRes: any) => {
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            if(dbRes.length != 0){
                return res.status(CONFLICT).json({"message":"peerId exists"});
            }
            console.log(StartStreamingRequest);
            let newStream = new Stream(StartStreamingRequest);
            newStream.save((err: any, dbRes: any) => {
                if (err) {
                    return res.status(INTERNAL_SERVER_ERROR).json(err);
                } else {
                    return res.json(dbRes);
                }
            });
        });
    }

    @Post('addAlert')
    @Middleware(isAuthenticated)
    private addAlert(req: Request, res: Response){
        Logger.Info(req.url);
        if(req.session?.user !== req.body.username){
            return res.status(UNAUTHORIZED).json({"message":"cannot start stream of another user"});
        }
        Stream.find({peerId: req.body.peerId}).exec((err:any, dbRes:IStream[]) => {
            if(err){
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            console.log(dbRes);
            let increm = dbRes[0].alerts + 1;
            let query = { peerId: req.body.peerId };
            let newvalues = { $set: {alerts: increm}};
            Stream.updateOne(query, newvalues, (err2, dbRes2) => {
                if (err2) return res.status(BAD_REQUEST).json(err2);
                return res.status(OK).json({ "message": "Alerts incremented" });
            });
        })
    }
}