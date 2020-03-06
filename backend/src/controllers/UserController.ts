import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

@Controller('api/users')
export class UserController {

    @Post('signup')
    private signup(req: Request, res: Response) {
        Logger.Info(req.body);
        res.status(200).json({
            message: "hi",
        });
    }
}