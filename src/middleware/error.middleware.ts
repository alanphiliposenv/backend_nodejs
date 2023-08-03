import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http.exception";
import ValidationException from "../exceptions/validation.exception";

function errorMiddlerware(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ValidationException) {
        res.status(error.status).send({
            message: error.message,
            errors: error.errors,
        });
    } else if (error instanceof HttpException) {
        res.status(error.status).send({
            message: error.message,
        });
    } else {
        res.status(500).send({
            message: error.message
        });
    }
}

export default errorMiddlerware;
