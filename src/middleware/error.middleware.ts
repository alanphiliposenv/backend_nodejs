import { NextFunction } from "express";
import HttpException from "../exceptions/http.exception";
import ValidationException from "../exceptions/validation.exception";
import { ResponseWithPayload } from "../util/responseWithPayload.interface";
import { RequestWithId } from "../util/requestWithId.interface";
import logger from "../util/logger.util";

function errorMiddlerware(error: Error, req: RequestWithId, res: ResponseWithPayload, _next: NextFunction) {
    if (error instanceof ValidationException) {
        res.status(error.status).sendPayload(error.message, null, error.errors);
    } else if (error instanceof HttpException) {
        logger.warn(`${req.id} ${error.status} ${error.message}`);
        res.status(error.status).sendPayload(error.message, null, null);
    } else {
        logger.error(`${req.id} 500 ${error.message}`);
        res.sendPayload(error.message, null, null);
    }
}

export default errorMiddlerware;
