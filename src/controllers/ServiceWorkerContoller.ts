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
webpush.setVapidDetails('mailto: seanapplebaum@gmail.com', publicVapidKey, privateVapidKey)


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

    // SEND NOTIFICATIONS (TODO: Based on a stream)
    @Post('sendnotifications')
    private sendnotifications(req: Request, res: Response) {
        const title = req.body.title;
        const body = req.body.body;
        const leftText = req.body.leftText;
        const rightText = req.body.rightText;
        const url = req.body.url;

        console.log(req.body.username)

        User.find({ username: req.body.username }).exec((err: NativeError, result: IUser[]) => {
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            else if (result.length === 0) {
                return res.status(NOT_FOUND).json({ "message": "user not found" }).end();
            } else {
                // Ping le devices
                for (let i = 0; i < result[0].devices.length; i++) {
                    if (result[0].devices[i].isReceivingNotifications) {
                        let payload =
                            JSON.stringify({
                                title: title,
                                body: body,
                                data: {
                                    leftText: leftText,
                                    rightText: rightText,
                                    url: url
                                }
                            });

                        webpush.sendNotification(result[0].devices[i].subscription, payload)
                            .then((result: any) => console.log(result))
                            .catch((e: any) => console.log(e.stack))
                    }
                }

            }
        });


        res.status(200).json({ 'success': true, 'message': 'le pinged' });
    }

    @Get('test')
    private test(req: Request, res: Response) {
        res.send('Hello world!');
    }

}

