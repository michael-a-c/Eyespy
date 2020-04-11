import { Request, Response } from "express";
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { NativeError, Schema } from 'mongoose';
import { Stream, StreamSchema, IStream, User, IUser } from "./repository";

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
        console.log('Email Server set up for streams');
    }
});

const publicVapidKey = "BN8eHyQuJvNk4XG61iVxdLlS78zHZCspP4TyG5EuOjj1royj3EmCl_R_2Q5-gMxQ2x0OfUByEAzmWTFf2fGyVTo"//process.env.publicVapidKey
const privateVapidKey = "3ki5FfwrzZZcFPD49UeGPXiWCEpvJUjUD1iVlw4HfKo"//process.env.privateVapidKey

const webpush = require('web-push')
webpush.setVapidDetails('mailto: eyespy978@gmail.com', publicVapidKey, privateVapidKey)

export function sendStreamNotification(req: Request, res: Response) {


    if (req.session?.user !== req.body.username) {
        return res.status(UNAUTHORIZED).json({ "message": "cannot start stream of another user" });
    }


    Stream.find({ peerId: req.body.peerId }).exec((err: any, dbRes: any) => {
        if (err) {
            return res.status(INTERNAL_SERVER_ERROR).json(err);
        }

        if (dbRes.length > 1 || dbRes.length < 1) {
            return res.status(CONFLICT).json({ "message": "invalid stream" });
        }

        User.find({ username: dbRes[0].username }).exec((err: NativeError, result: IUser[]) => {
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            else if (result.length === 0) {
                return res.status(NOT_FOUND).json({ "message": "Something went wrong with your information, please log out and log back in" }).end();
            } else {

                /// If set up, send email notification
                if (dbRes[0].streamingOptions.email) {
                    let mail;
                    if (req.body.emailoptions.imagePath) {
                        mail = {
                            from: "EyeSpy Security",
                            to: result[0].email,
                            subject: req.body.emailoptions.subject,
                            html: req.body.emailoptions.content,
                            attachments: [
                                {
                                    filename: 'screen-shot.jpg',
                                    content: fs.createReadStream(req.body.emailoptions.imagePath)
                                }]
                        };
                    } else {
                        mail = {
                            from: "EyeSpy Security",
                            to: result[0].email,
                            subject: req.body.emailoptions.subject,
                            html: req.body.emailoptions.content,

                        };
                    }
                    transporter.sendMail(mail, (err: any, data: any) => {
                        if (err) {
                            res.status(BAD_REQUEST).json({
                                message: 'Failure in sedning E-mail'
                            })
                        } else {
                            res.status(OK).json({
                                message: 'E-mail sent successfully'
                            })
                        }
                    })

                }

                /// If setup, send SMS notifications
                if (dbRes[0].streamingOptions.sms) {
                    let userP = '+1' + result[0].phone;
                    let fullSMS = req.body.smsoptions.title + req.body.smsoptions.body + req.body.smsoptions.url;
                    if (userP == "+1") {
                        return res.status(OK).json({ "message": "no phone number for account" });
                    }
                    twilio.messages.create({
                        body: fullSMS,
                        from: '+12057298375',
                        to: userP
                    });
                }


                /// If set up, send push notifications
                if (dbRes[0].streamingOptions.push) {

                    // For every device in user
                    // If device is selected in stream, notify it



                    for (let i = 0; i < result[0].devices.length; i++) {
                        if (dbRes[0].devices.includes(result[0].devices[i].deviceName)) {

                            let payload;

                            let image = "";
                            if (req.body.pushoptions.image) {
                                image = req.body.pushoptions.image
                            }


                            if (!req.body.pushoptions.leftText || !req.body.pushoptions.rightText || !req.body.pushoptions.url) {
                                payload =
                                {
                                    title: req.body.pushoptions.title,
                                    body: req.body.pushoptions.body,
                                    image: image
                                };
                            } else {
                                payload =
                                {
                                    title: req.body.pushoptions.title,
                                    body: req.body.pushoptions.body,
                                    image: image,
                                    data: {
                                        leftText: req.body.pushoptions.leftText,
                                        rightText: req.body.pushoptions.rightText,
                                        url: req.body.pushoptions.url
                                    }
                                };
                            }

                            webpush.sendNotification(result[0].devices[i].subscription, JSON.stringify(payload))
                                .then((result: any) => console.log(result))
                                .catch((e: any) => console.log(e.stack))

                        }
                        }

                    }
                }
            });
    });
}

