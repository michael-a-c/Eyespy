import { Response, Request } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { SignupRequestMaker, SignupRequest, SigninRequest, SigninRequestMaker, DeviceAdditionRequest, DeviceAdditionRequestMaker } from '../Requests'
import { User, UserSchema, IUser } from "../repository";
import { NativeError } from 'mongoose';
import { isAuthenticated } from '../middleware'
const bcrypt = require('bcryptjs');

@Controller('api/user')
export class UserController {

    @Post('signup')
    private signUp(req: Request, res: Response) {
        Logger.Info(req.url);
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
        Logger.Info(req.url);
        let signinRequest: any;
        try {
            signinRequest = SigninRequestMaker.create(req.body);
        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }

        User.find({ username: signinRequest.username }).exec((err: NativeError, result: IUser[]) => {
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            else if (result.length === 0) {
                return res.status(NOT_FOUND).json({ "message": "user not found" }).end();
            } else {
                bcrypt.compare(signinRequest.password, result[0].password, function (err: any, valid: boolean) {
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
        Logger.Info(req.url);
        //TODO
        return res.status(OK).json({
            message: 'update_called',
        });
    }

    @Put('add-new-device')
    @Middleware(isAuthenticated)
    private adddevice(req: Request, res: Response) {
        Logger.Info(req.url);
        let DeviceAdditionRequest: any;
        try {
            DeviceAdditionRequest = DeviceAdditionRequestMaker.create(req.body);
        } catch (e) {
            return res.status(BAD_REQUEST).json(e.message)
        }

        return User.find({ username: DeviceAdditionRequest.username }).exec((err: NativeError, result: IUser[]) => {
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            else if (result.length === 0) {
                return res.status(NOT_FOUND).json({ "message": "Something went wrong with your information, please log out and log back in" }).end();
            } else {
                //Check if device exists already
                let conflictErr = false;

                result[0].devices.forEach((device: any) => {
                    if (device.deviceName == DeviceAdditionRequest.deviceName) {
                        conflictErr = true
                    }
                });

                if (conflictErr) return res.status(CONFLICT).json({ "message": "You already have a device with this name, please select another name" }).end();

                // Create new device
                let newDevice = {
                    deviceName: DeviceAdditionRequest.deviceName,
                    subscription: DeviceAdditionRequest.subscription,
                    isRecording: DeviceAdditionRequest.isRecording,
                    isReceivingNotifications: DeviceAdditionRequest.isReceivingNotifications
                }
                //Add the device to the user
                result[0].devices.push(newDevice)
                // Update the user with the new device
                let query = { username: DeviceAdditionRequest.username }
                let newvalue = { $set: { devices: result[0].devices } }
                User.updateOne(query, newvalue, (err2, res2) => {
                    if (err2) return res.status(BAD_REQUEST).json(err2);
                    return res.status(OK).json({ "message": "Device saved to database" });
                });
            }
        });
    }

    @Get("signout")
    private signout(req: Request, res: Response) {
        Logger.Info(req.url);

        if (!req.session!.user) {
            return res.status(BAD_REQUEST).json({ "message": "you're not signed in ya muppet" });
        }
        req.session?.destroy(() => {
            return res.json({ "message": "signed out" });
        });

    }

    @Put('remove-device')
    private removedevice(req: Request, res: Response) {
        Logger.Info(req.url);

        if (!req.session!.user) {
            return res.status(BAD_REQUEST).json({ "message": "you're not signed in ya muppet" });
        }

        return User.find({ username: req.session!.user }).exec((err: NativeError, result: IUser[]) => {
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            else if (result.length === 0) {
                return res.status(NOT_FOUND).json({ "message": "Something went wrong with your information, please log out and log back in" }).end();
            } else {
                // For each device check if its the one to be removed

                //Check if device exists already
                let deviceIndex = -1;

                for (let i = 0; i < result[0].devices.length; i++) {
                    if (result[0].devices[i].deviceName == req.body.deviceName) {
                        deviceIndex = i;
                    }
                }

                if (deviceIndex === -1) return res.status(CONFLICT).json({ "message": "Could not find the device" }).end();

                // remove it
                result[0].devices.splice(deviceIndex, 1);
                // Update the user with the new device
                let query = { username: req.session!.user }
                let newvalue = { $set: { devices: result[0].devices } }
                User.updateOne(query, newvalue, (err2, res2) => {
                    if (err2) return res.status(BAD_REQUEST).json(err2);
                    return res.status(OK).json({ "message": "Successfully removed the device" });
                });
            }

        });
    }

    @Get("devices")
    @Middleware(isAuthenticated)
    private getdevices(req: Request, res: Response) {
        Logger.Info(req.url);

        if (!req.session!.user) {
            return res.status(BAD_REQUEST).json({ "message": "you're not signed in ya muppet" });
        }

        User.find({ username: req.session?.user }).exec((err: NativeError, result: IUser[]) => {
            console.log("here")
            if (err) {
                return res.status(INTERNAL_SERVER_ERROR).json(err);
            }
            else if (result.length === 0) {
                return res.status(NOT_FOUND).json({ "message": "Something went wrong with your information, please log out and log back in" }).end();
            } else {
                //Return the users devices
                return res.status(OK).json({ "message": "Successfully retrieved devices", "devices": result[0].devices });
            }
        });
    }

    @Get("whoami")
    @Middleware(isAuthenticated)
    private whoami(req: Request, res: Response) {
        Logger.Info(req.url);
        return res.status(OK).json({ "username": req.session?.user });
    }
}