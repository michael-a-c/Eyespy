import { Response, Request } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { SignupRequestMaker, SignupRequest, SigninRequest, SigninRequestMaker } from '../Requests'
import { User, UserSchema, IUser } from "../repository";
import { NativeError } from 'mongoose';
import { isAuthenticated } from '../middleware'

const dotenv = require('dotenv');
dotenv.config();

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


@Controller('api/email')
export class EmailController {

    //SEND SINGLE EMAIL
    @Post('sendemail')
    private sendemail(req: Request, res: Response) {
        /// These are parameters
        let email = req.body.email
        let message = req.body.message
        let content = `<img src="frontend/public/face.jpg">`

        var mail = {
            from: "EyeSpy Security",
            to: 'seanapplebaum@gmail.com',  //Change to email address that you want to receive messages on
            subject: 'Intruder has been detected!',
            html: content,
            attachments: [
                {   // utf-8 string as an attachment
                    filename: 'img.jpg',
                    content: fs.readFileSync("frontend/public/face.jpg")
                }]
        }

        console.log("SENDING EMAIL");

        transporter.sendMail(mail, (err: any, data: any) => {
            if (err) {
                res.status(500).json({
                    msg: 'fail'
                })
            } else {
                res.status(200).json({
                    msg: 'success'
                })
            }
        })

        res.status(200).json({ 'success': true });
    }


}

