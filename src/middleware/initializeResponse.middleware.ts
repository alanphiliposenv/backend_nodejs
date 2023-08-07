import { NextFunction } from "express";
import { ResponseWithPayload } from "../util/responseWithPayload.interface";
import { ResponseMetadata } from "../util/responseMetadata.class";
import { ValidationTypes } from "class-validator";
import Employee from "../entity/employee.entity";
import logger from "../util/logger.util";
import { RequestWithId } from "../util/requestWithId.interface";

function initialzeResponseMiddleware(req: RequestWithId, res: ResponseWithPayload, next: NextFunction) {
    res.startTime = Date.now();

    res.sendPayload = function <T>(message: string, data: T | null, errors: ValidationTypes | null) {
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
        } else if (Array.isArray(data)) {
            data.forEach((d) => {
                if (d instanceof Employee) {
                    delete d.password
                }
            })
            meta.length = data.length;
        } else {
            if (data instanceof Employee) {
                delete data.password;
            }
            meta.length = 1;
        }
        const endTime: number = Date.now();
        meta.total = res.total ? res.total : meta.total;
        meta.took = endTime - res.startTime;
        res.json({
            data,
            errors,
            message,
            meta,
        });
        if (data !== null) {
            logger.info(`${req.id} Response: ${res.statusCode} ${message} ${meta.took}ms`);
        }
    };
    next();
}

export default initialzeResponseMiddleware;
