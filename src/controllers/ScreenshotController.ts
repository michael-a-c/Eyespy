import { Response, Request } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { CreateScreenshotRequest, CreateScreenshotRequestMaker} from '../Requests'
import { Screenshot, UserSchema, IUser } from "../repository";
import { NativeError } from 'mongoose';
import { isAuthenticated } from '../middleware'

const multer = require("multer");
const upload = multer({ dest: './uploads/' });

interface MulterRequest extends Request {
    file: any;
}

@Controller('api/screenshot')

export class ScreenshotController {
    
    @Post('create')
    // @Middleware(isAuthenticated)
    @Middleware(upload.single('picture'))
    private create(req: MulterRequest, res: Response) {
        Logger.Info(req.url);
        let createScreenshotRequest: any;
        try {
            createScreenshotRequest = CreateScreenshotRequestMaker.create(/*req.session!.user*/ "bing bong", req.body.title);
        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }
        // check that image upload succeeded
        if (!req.file) return res.status(400).end("BAD REQUEST: improperly formatted image");
        console.log(req.file);
        let newScreenshot = new Screenshot({username: "bing bong", title: createScreenshotRequest.title, path: req.file.path, mimetype: req.file.mimetype });
        newScreenshot.save((err) => {
            if(err) {res.status(INTERNAL_SERVER_ERROR).end("Server Error")}
            else {
                res.json(req.file);
            }
        });
    }

    @Get('view')
    //@Middleware(isAuthenticated)
    private view(req: Request, res: Response) {
        Logger.Info(req.url);
       
    }

    @Get('list')
    @Middleware(isAuthenticated)
    private list(req: Request, res: Response){

    }
}