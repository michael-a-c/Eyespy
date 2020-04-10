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

console.log("key: ", process.env.publicVapidKey)

const publicVapidKey = "BN8eHyQuJvNk4XG61iVxdLlS78zHZCspP4TyG5EuOjj1royj3EmCl_R_2Q5-gMxQ2x0OfUByEAzmWTFf2fGyVTo"//process.env.publicVapidKey
const privateVapidKey = "3ki5FfwrzZZcFPD49UeGPXiWCEpvJUjUD1iVlw4HfKo"//process.env.privateVapidKey

const webpush = require('web-push')
webpush.setVapidDetails('mailto: eyespy978@gmail.com', publicVapidKey, privateVapidKey)


@Controller('api/serviceworker')
export default class ServiceWorkerController {

    //SEND SINGLE NOTIF
    @Post('sendnotification')
    private sendnotification(req: Request, res: Response) {
        /// These are parameters
        const subscription = req.body.subscription;
        const title = req.body.title;
        const body = req.body.body;
        let image = ""; //optional
        let leftText; //optional
        let rightText; //optional
        let url = ""; //optional

        let addData = true;

        if (req.body.image) {
            image = req.body.image;
        }
        if (req.body.leftText && req.body.rightText) {
            leftText = req.body.leftText;
            rightText = req.body.rightText;
            if (req.body.url) {
                url = req.body.url;
            }
        } else (addData = false)


        let payload;
        if (addData) {
            payload =
                JSON.stringify({
                    title: title,
                    body: body,
                    image: image,
                    data: {
                        leftText: leftText,
                        rightText: rightText,
                        url: url
                    }
                });
        } else {
            payload =
                JSON.stringify({
                    title: title,
                    body: body,
                    image: image
                });
        }



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

