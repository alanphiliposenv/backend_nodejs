import { NextFunction, Request, Response } from "express";
import EmployeeDto from "../dto/employee.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import ValidationException from "../exceptions/validation.exception";

type DTO<T extends object> = new(...args: unknown[]) => T;

function validattionMiddleware<T extends object>(Dto: DTO<T>, property: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToInstance(Dto, req[property]);
            const errors = await validate(dto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            }
            req[property] = dto;
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default validattionMiddleware;