import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST } from 'http-status-codes';
import Requests from '../model/Requests';

@Controller('api/user')
export class UserController {

    @Post('signup')
    private signup(req: Request, res: Response) {
        Logger.Info(req.body);
        
        let signupRequest = Requests.SignupRequestMaker.create(req.body);
        
        res.status(OK).json(signupRequest);
    }

    @Post('signin')
    private signin(req: Request, res: Response) {
        Logger.Info(req.body);
        res.status(OK).json({
            message: "signin",
        });
    }
    @Put('update-user')
    private update(req: Request, res: Response) {
        Logger.Info(req.body);
        return res.status(OK).json({
            message: 'update_called',
        });
    }

    @Get("signout")
    private signout(req : Request, res : Response){
        Logger.Info(req.body);
        res.status(OK).json({
            message: "signout"
        })
    }
}