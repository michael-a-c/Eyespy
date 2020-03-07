import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT } from 'http-status-codes';
import { SignupRequestMaker, SignupRequest, SigninRequest, SigninRequestMaker } from '../model/Requests'
import { User, UserSchema} from "../repository";

@Controller('api/user')
export class UserController {

    @Post('signup')
    private signUp(req: Request, res: Response) {
        Logger.Info(req.body);
        let signupRequest : SignupRequest;
        try {
            signupRequest = SignupRequestMaker.create(req.body);
            // Check if user already exists.
            let newUser = new User(signupRequest);
            newUser.save((err: any) => {
                if (err && err.code === 11000) {
                    return res.status(CONFLICT).json({"message":"user already exists"});
                } else if(err){
                    return res.status(INTERNAL_SERVER_ERROR).json(err);
                } else{
                    return res.status(OK).json(signupRequest);

                }
            });
        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }

    }

    @Post('signin')
    private signin(req: Request, res: Response) {
        Logger.Info(req.body);
        let signinRequest;
        try {
            signinRequest = SigninRequestMaker.create(req.body);
        } catch (e) {
            res.status(BAD_REQUEST).json(e.message)
        }

        res.status(OK).json(signinRequest);
    }

    @Put('update-user')
    private update(req: Request, res: Response) {
        Logger.Info(req.body);
        //TODO
        return res.status(OK).json({
            message: 'update_called',
        });
    }

    @Get("signout")
    private signout(req: Request, res: Response) {
        Logger.Info(req.body);
        res.status(OK).json({
            message: "signout"
        })
    }
}