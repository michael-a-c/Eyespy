import { Response, Request } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';

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
        let subject = req.body.subject
        let content = req.body.content
        let imagePath;


        let mail;
        if (req.body.imagePath) {
            imagePath = req.body.imagePath
            mail = {
                from: "EyeSpy Security",
                to: email,
                subject: subject,
                html: content,
                attachments: [
                    {   
                        filename: 'screen-shot.jpg',
                        content: fs.readFileSync(imagePath)
                    }]
            }
        } else {
            mail = {
                from: "EyeSpy Security",
                to: email,
                subject: subject,
                html: content,
            }
        }
        console.log(mail);
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

        res.status(INTERNAL_SERVER_ERROR).json({ message: 'Failure in sedning E-mail' });
    }


}

