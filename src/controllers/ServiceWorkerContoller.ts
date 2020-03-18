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

const publicVapidKey = 'BJQ8iD1NgY3xgdHuGCiJ4K__0pqq5f0Q8xNa22YBEpm2Tp_5HXbTBgvjNxp1DJ5q6NBZoPfS6ow3-eDuU1E37JI'
const privateVapidKey = 'SE6CoB9hiAVgIc8E-SrI8iX8i1NstbAnw6H0coY5kiI'

const webpush = require('web-push')
webpush.setVapidDetails('mailto: seanapplebaum@gmail.com', publicVapidKey, privateVapidKey)


@Controller('api/serviceworker')
export default class ServiceWorkerController {

    //SEND SINGLE NOTIF
    @Post('sendnotification')
    private sendnotification(req: Request, res: Response) {
        const subscription = req.body.subscription;
        const title = req.body.title;
        const body = req.body.body;

        const payload = 
        JSON.stringify({
            title: title,
            body: body
        });

        console.log(subscription)

        webpush.sendNotification(subscription, payload)
            .then((result: any) => console.log(result))
            .catch((e: any) => console.log(e.stack))

        res.status(200).json({ 'success': true });
    }

    // SEND NOTIFICATIONS
    @Post('sendnotifications')
    private sendnotifications(req: Request, res: Response) {
        const title = req.body.title;
        const body = req.body.body;

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
                                body: body
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

