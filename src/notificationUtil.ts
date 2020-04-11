import { Request, Response } from "express";
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { NativeError, Schema } from 'mongoose';
import { Stream, StreamSchema, IStream, User, IUser } from "./repository";

const twilio = require('twilio')(process.env.twilioAccountID, process.env.twilioAuthToken);

var nodemailer = require('nodemailer');
var fs = require('fs');


var transport = {
    host: 'smtp.gmail.com',
    auth: {
        user: 'eyespy978@gmail.com',
        pass: process.env.emailPassword
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


const publicVapidKey = process.env.publicVapidKey
const privateVapidKey = process.env.privateVapidKey

const webpush = require('web-push')
webpush.setVapidDetails('mailto: eyespy978@gmail.com', publicVapidKey, privateVapidKey)

export function sendStreamNotification(streamInterface: IStream, notificationOptions: any) {


    User.find({ username: streamInterface.username }).exec((err: NativeError, user: IUser[]) => {


        /// If set up, send email notification
        if (streamInterface.streamingOptions.email) {
            let mail;
            if (notificationOptions.emailoptions.imagePath) {
                mail = {
                    from: "EyeSpy Security",
                    to: user[0].email,
                    subject: notificationOptions.emailoptions.subject,
                    html: notificationOptions.emailoptions.content,
                    attachments: [
                        {
                            filename: 'screen-shot.jpg',
                            content: fs.createReadStream(notificationOptions.emailoptions.imagePath)
                        }]
                };
            } else {
                mail = {
                    from: "EyeSpy Security",
                    to: user[0].email,
                    subject: notificationOptions.emailoptions.subject,
                    html: notificationOptions.emailoptions.content,

                };
            }
            transporter.sendMail(mail, (err: any, data: any) => {
                if (err) {
                    console.log(err);
                }
            })

        }

        /// If setup, send SMS notifications
        if (streamInterface.streamingOptions.sms) {
            let userP = '+1' + user[0].phone;
            let fullSMS = notificationOptions.smsoptions.title + notificationOptions.smsoptions.body + notificationOptions.smsoptions.url;
            if (userP !== "+1") {
                twilio.messages.create({
                    body: fullSMS,
                    from: '+12057298375',
                    to: userP
                });
            }

        }


        /// If set up, send push notifications
        if (streamInterface.streamingOptions.push) {

            // For every device in user
            // If device is selected in stream, notify it



            for (let i = 0; i < user[0].devices.length; i++) {
                if (streamInterface.devices.includes(user[0].devices[i].deviceName)) {

                    let payload;

                    let image = "";
                    if (notificationOptions.pushoptions.image) {
                        image = notificationOptions.pushoptions.image
                    }


                    if (!notificationOptions.pushoptions.leftText || !notificationOptions.pushoptions.rightText || !notificationOptions.pushoptions.url) {
                        payload =
                        {
                            title: notificationOptions.pushoptions.title,
                            body: notificationOptions.pushoptions.body,
                            image: image
                        };
                    } else {
                        payload =
                        {
                            title: notificationOptions.pushoptions.title,
                            body: notificationOptions.pushoptions.body,
                            image: image,
                            data: {
                                leftText: notificationOptions.pushoptions.leftText,
                                rightText: notificationOptions.pushoptions.rightText,
                                url: notificationOptions.pushoptions.url
                            }
                        };
                    }

                    webpush.sendNotification(user[0].devices[i].subscription, JSON.stringify(payload))
                        .then((result: any) => console.log(result))
                        .catch((e: any) => console.log(e.stack))

                }
            }

        }
    });
}


