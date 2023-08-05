import { NextFunction, Request } from "express";
import HttpException from "../exceptions/http.exception";
import ValidationException from "../exceptions/validation.exception";
import { ResponseWithPayload } from "../util/responseWithPayload.interface";

function errorMiddlerware(error: Error, _req: Request, res: ResponseWithPayload, _next: NextFunction) {
    if (error instanceof ValidationException) {
        res.status(error.status).sendPayload(error.message, null, error.errors);
    } else if (error instanceof HttpException) {
        res.status(error.status).sendPayload(error.message, null, null);
    } else {
        res.sendPayload(error.message, null, null);
    }
}

export default errorMiddlerware;
