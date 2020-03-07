import { Response, Request } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { SignupRequestMaker, SignupRequest, SigninRequest, SigninRequestMaker } from '../model/Requests'
import { User, UserSchema, IUser } from "../repository";
import { NativeError } from 'mongoose';
const bcrypt = require('bcryptjs');

@Controller('api/user')
export class UserController {

    @Post('signup')
    private signUp(req: Request, res: Response) {
        Logger.Info(req.body);
        let signupRequest: SignupRequest;
        try {
            signupRequest = SignupRequestMaker.create(req.body);
        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }
        bcrypt.genSalt(10, function (err: any, salt: any) {
            bcrypt.hash(signupRequest.password, salt, function (err: any, hash: any) {
                // insert new user into the database
                signupRequest.password = hash;
                let newUser = new User(signupRequest);

                newUser.save((err: any) => {
                    if (err && err.code === 11000) {
                        return res.status(CONFLICT).json({ "message": "user already exists" });
                    } else if (err) {
                        return res.status(INTERNAL_SERVER_ERROR).json(err);
                    } else {
                        return res.status(OK).json({ "username": signupRequest.username });
                    }
                });
            });
        });

    }

    @Post('signin')
    private signin(req: Request, res: Response) {
        Logger.Info(req.body);
        let signinRequest : any;
        try {
            signinRequest = SigninRequestMaker.create(req.body);
           
        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }

        User.find({username: signinRequest.username}).exec((err:NativeError, result: IUser[]) => {
            if(err){
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            else if(result.length === 0){
                return res.status(NOT_FOUND).json({ "message": "user not found" }).end();
            } else {
                bcrypt.compare(signinRequest.password, result[0].password , function (err:any, valid:boolean) {
                    if (err) return res.status(INTERNAL_SERVER_ERROR).end(err);
                    if (!valid) return res.status(UNAUTHORIZED).json({ "message": "access denied" });
                    req.session!.user = result[0].username;
                    return res.status(OK).json({ "username": signinRequest.username });
                });
            }
        });
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
        req.session?.destroy(() => {
            return res.json({ "message": "signed out" });
        });

    }
}