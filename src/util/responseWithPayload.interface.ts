import { Response } from "express";
import { ValidationErrors } from "./errors.type";

export interface ResponseWithPayload extends Response {
    startTime: number;

    sendPayload<T>(
        message: string,
        data: T | null,
        errors: ValidationErrors | null,
    ): void;
}
