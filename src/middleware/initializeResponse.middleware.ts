import { NextFunction, Request } from "express";
import { ResponseWithPayload } from "../util/responseWithPayload.interface";
import { ResponseMetadata } from "../util/responseMetadata.class";
import { ValidationTypes } from "class-validator";

function initialzeResponseMiddleware(_req: Request, res: ResponseWithPayload, next: NextFunction) {
    res.startTime = Date.now();

    res.sendPayload = function <T>(
        message: string,
        data: T | null,
        errors: ValidationTypes | null) {
            const meta: ResponseMetadata = {
                length: 0,
                took: 0,
                total: 0,
            };

            if (errors !== null) {
                data = null;
            }

            if (data === null) {
                meta.length = 0;
                meta.total = 0;
            } else if (Array.isArray(data)) {
                meta.length = data.length;
                meta.total = data.length;
            } else {
                meta.length = 1;
                meta.total = 1;
            }
            const endTime: number = Date.now();
            meta.took = endTime - res.startTime;

        res
        .json({
            data,
            errors,
            message,
            meta,
        });

    };
    next();
}

export default initialzeResponseMiddleware;
