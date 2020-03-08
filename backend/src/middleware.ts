import { Request, Response, NextFunction } from "express";

import { UNAUTHORIZED, METHOD_FAILURE } from 'http-status-codes';

export function isAuthenticated (req: Request, res: Response, next : NextFunction)  {
    if (!req.session!.user) return res.status(UNAUTHORIZED).json({ "message": "access denied" });
    return next();
}
