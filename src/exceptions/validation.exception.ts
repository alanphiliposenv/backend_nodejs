import { ValidationError } from "class-validator";
import HttpException from "./http.exception";

type ValidationErrors = {
    [key: string]: string[] | ValidationErrors
}

class ValidationException extends HttpException {
    public errors: ValidationErrors

    constructor(status: number, message: string, errors: ValidationError[]) {
        super(status, message);
        this.errors = this.validationErrorParser(errors);
    }

    validationErrorParser(validationErrors: ValidationError[]): ValidationErrors {
        const errors: ValidationErrors = {};
        validationErrors.forEach((err) => {
            if (err.children.length > 0) {
                errors[err.property] = this.validationErrorParser(err.children);
            } else {
                const constraints: string[] = [];
                for (const constraint in err.constraints) {
                    constraints.push(err.constraints[constraint]);
                }
                errors[err.property] = constraints;
            }
        });
        return errors;
    }
}


export default ValidationException;
