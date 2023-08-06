import { NextFunction, Response } from "express";
import logger from "../util/logger.util";
import { v4 as uuidv4 } from "uuid";
import { RequestWithId } from "../util/requestWithId.interface";

function loggerMiddleware(req: RequestWithId, _res: Response, next: NextFunction) {
    const id = uuidv4();
    req.id = id;
    logger.info(`${req.id} ${req.url} ${req.method}`);
    next();
}

export default loggerMiddleware;
