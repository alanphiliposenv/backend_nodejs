import { NextFunction, Request, Response } from "express";

function loggerMiddleware(req: Request, _res: Response, next: NextFunction) {
    console.log(`[${new Date()}] ${req.url} ${req.method}`);
    next();
}

export default loggerMiddleware;
