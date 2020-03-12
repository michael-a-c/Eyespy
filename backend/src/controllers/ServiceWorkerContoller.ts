import { Response, Request } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { SignupRequestMaker, SignupRequest, SigninRequest, SigninRequestMaker } from '../Requests'
import { User, UserSchema, IUser } from "../repository";
import { NativeError } from 'mongoose';
import { isAuthenticated } from '../middleware'
const bcrypt = require('bcryptjs');

const dotenv = require('dotenv');
dotenv.config();

const publicVapidKey = 'BKdAf4wZ1P1Lj2eLC56FMAWBggkimcNWsM98Eznu0gBsiRLk_5QA3DwQ2PcumLSpGPHwxTBkhcItxl96vfSUIPI';
const privateVapidKey = 'VTKDYGn12pvy2fHEYuy_GEWenDuQWsCXK9N56tQ5LMY';

const webpush = require('web-push')
webpush.setVapidDetails('mailto: seanapplebaum@gmail.com', publicVapidKey, privateVapidKey)


@Controller('api/serviceworker')
export default class ServiceWorkerController {

    @Post('subscribe')
    private subscribe(req: Request, res: Response) {
        const subscription = req.body.subscription;
        const title = req.body.title;
        const body = req.body.body;

        const payload = 
        JSON.stringify({
            title: title,
            body: body,
        });

        webpush.sendNotification(subscription, payload)
            .then((result: any) => console.log(result))
            .catch((e: any) => console.log(e.stack))

        res.status(200).json({ 'success': true });
    }

    @Get('test')
    private test(req: Request, res: Response) {
        res.send('Hello world!');
    }

}