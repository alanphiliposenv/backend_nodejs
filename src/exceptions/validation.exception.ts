import { ValidationError } from "class-validator";
import HttpException from "./http.exception";
import { ValidationErrors } from "../util/errors.type";

class ValidationException extends HttpException {
    public errors: ValidationErrors

    constructor(errors: ValidationError[]) {
        super(400, "Validation Error");
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
