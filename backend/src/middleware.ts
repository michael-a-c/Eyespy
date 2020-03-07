import { Response, NextFunction } from "express";
import { Request } from '../interfaces'

import { UNAUTHORIZED, METHOD_FAILURE } from 'http-status-codes';

let isAuthenticated = (req: Request, res: Response, next : NextFunction) => {
    if (!req.session.user) return res.status(UNAUTHORIZED).json({ "message": "access denied" });
    return next();
}

export default {isAuthenticated}