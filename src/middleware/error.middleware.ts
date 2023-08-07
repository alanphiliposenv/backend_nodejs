import { NextFunction } from "express";
import HttpException from "../exceptions/http.exception";
import ValidationException from "../exceptions/validation.exception";
import { ResponseWithPayload } from "../util/responseWithPayload.interface";
import { RequestWithId } from "../util/requestWithId.interface";
import logger from "../util/logger.util";
import { JsonWebTokenError } from "jsonwebtoken";

function errorMiddlerware(error: Error, req: RequestWithId, res: ResponseWithPayload, _next: NextFunction) {
    const took = Date.now() - res.startTime;
    if (error instanceof ValidationException) {
        res.status(error.status).sendPayload(error.message, null, error.errors);
        logger.warn(`${req.id} Response: ${error.status} ${error.message} ${took}ms`);
    } else if (error instanceof HttpException) {
        logger.warn(`${req.id} Response: ${error.status} ${error.message} ${took}ms`);
        res.status(error.status).sendPayload(error.message, null, null);
    } else if (error instanceof JsonWebTokenError) {
        res.status(403).sendPayload(error.message, null, null);
        logger.warn(`${req.id} Response: 403 ${error.message} ${took}ms`);
    }else {
        logger.error(`${req.id} Response: 500 ${error.message} ${took}`);
        res.sendPayload(error.message, null, null);
    }
}

export default errorMiddlerware;
