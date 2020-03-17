import { Response, Request } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { StartStreamingRequest, StartStreamingRequestMaker, StopStreamingRequest, StopStreamingRequestMaker } from '../Requests'
import { Stream, StreamSchema, IStream, User, IUser } from "../repository";
import { NativeError, Schema } from 'mongoose';
import {isAuthenticated} from '../middleware'
const bcrypt = require('bcryptjs');


@Controller('api/stream')
export class StreamingController {
    @Post('list')
    @Middleware(isAuthenticated)
    private list(req: Request, res:Response){
        Logger.Info(req.url);
        let username = req.session?.user;
        Stream.find({username: username}).exec((err:any, dbRes:any) => {
            if(err){
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            } else{
                return res.json(dbRes);
            }
        } );
    }
    @Post('stop')
    @Middleware(isAuthenticated)
    private stop(req: Request, res: Response) {
        Logger.Info(req.url);
        let stopStreamingRequest : StopStreamingRequest;
        try {
            stopStreamingRequest = StopStreamingRequestMaker.create(req.body);
            
        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }
        // 1. Make sure session user id === request user id
        if(req.session?.user !== stopStreamingRequest.username){
            return res.status(UNAUTHORIZED).json({"message":"cannot start stream of another user"});
        }
        // 2. Make sure password is correct
        User.find({username: stopStreamingRequest.username}).exec((err:NativeError, result: IUser[]) => {
            if(err){
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            else if(result.length === 0){
                return res.status(NOT_FOUND).json({ "message": "user not found" }).end();
            } else {
                bcrypt.compare(stopStreamingRequest.password, result[0].password , function (err:any, valid:boolean) {
                    if (err) return res.status(INTERNAL_SERVER_ERROR).json(err);
                    if (!valid) return res.status(UNAUTHORIZED).json({ "message": "access denied" });
                });
            }
            // 3. delete active stream
            Stream.findOneAndDelete({username: stopStreamingRequest.username, peerId: stopStreamingRequest.peerId}, (err:any, dbRes:any) => {
                if(!dbRes) {
                    return res.status(NOT_FOUND).end("No such stream"); 
                }
                if (err) return res.status(BAD_REQUEST).json(err);
                return res.json(dbRes);
            });
        });
    }

    @Post('start')
    @Middleware(isAuthenticated)
    private start(req: Request, res: Response) {
        Logger.Info(req.url);
        let StartStreamingRequest : StartStreamingRequest;
        try {
            StartStreamingRequest = StartStreamingRequestMaker.create(req.body);
            
        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }

        // make sure session user id === request user id
        if(req.session?.user !== StartStreamingRequest.username){
            return res.status(UNAUTHORIZED).json({"message":"cannot start stream of another user"});
        }

        // make sure there's no PeerId with same peerId in request
        Stream.find({peerId: StartStreamingRequest.peerId}).exec((err:any, dbRes:any) => {
            if(err){
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }

            if(dbRes.length != 0){
                return res.status(CONFLICT).json({"message":"peerId exists"});
            }
            let newStream = new Stream(StartStreamingRequest);
            newStream.save((err:any, dbRes:any) => {
                if(err){
                    return res.status(INTERNAL_SERVER_ERROR).json(err);
                } else{
                    return res.json(dbRes);
                }
            });
        });
    }
}