import { Response, Request } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { CreateScreenshotRequest, CreateScreenshotRequestMaker} from '../Requests'
import { Screenshot, UserSchema, IUser } from "../repository";
import { NativeError, Types} from 'mongoose';
import { isAuthenticated } from '../middleware'
const crypto = require('crypto');
var path = require('path');
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: './uploads/' });

interface MulterRequest extends Request {
    file: any;
}

@Controller('api/screenshot')

export class ScreenshotController {
    
    @Post('create')
    @Middleware(isAuthenticated)
    private create(req: MulterRequest, res: Response) {
        Logger.Info(req.url);
        let createScreenshotRequest: any;
        try {
            createScreenshotRequest = CreateScreenshotRequestMaker.create(req.session!.user, req.body.title, req.body.data);
        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }
        // check that image upload succeeded
        if (!req.body.data) return res.status(400).end("BAD REQUEST: improperly formatted image");
        let data = req.body.data.replace(/^data:image\/\w+;base64,/, "");
        let raw = Buffer.alloc(data.length,data, 'base64');
        let newFileName = crypto.randomBytes(Math.ceil(10 / 2)).toString('hex').slice(0, 10) + ".jpg";

        fs.writeFile(__dirname + '/../../uploads/'+newFileName, raw, function (err:any) {
            if (err) {;return res.status(INTERNAL_SERVER_ERROR).end("Server Error")};
            let newScreenshot = new Screenshot({username: req.session!.user, title: createScreenshotRequest.title, path: "uploads/"+newFileName, mimetype: "images/jpeg" });
            newScreenshot.save((err, result) => {
                if(err) { return res.status(INTERNAL_SERVER_ERROR).end("Server Error")}
                else {
                    res.json({id: result._id});
                }
            });
        });

    }

    @Get('view/:id')
    private view(req: Request, res: Response) {
        Logger.Info(req.url);
        let ObjectId = Types.ObjectId(req.params.id);
        Screenshot.findById(ObjectId, (err,result) =>{
            if(err) {
                return res.status(INTERNAL_SERVER_ERROR).end();
            }
            if(!result){
                return res.status(NOT_FOUND).end("image could not be found");
            } 
            res.sendFile(result.path, {'root': "."});
        })
    }

    @Get('list/')
    @Middleware(isAuthenticated)
    private list(req: Request, res: Response){
        Screenshot.find({username : req.session!.user}).sort({date: -1}).exec((err, result) => {
            if(err){
                return res.status(INTERNAL_SERVER_ERROR).end(INTERNAL_SERVER_ERROR);
            }
            let filteredArray = result.map((screenshot) =>{ return ({"id": screenshot.id, "title": screenshot.title, date:screenshot.date})});
            return res.json(filteredArray).end();
        })
    }
}