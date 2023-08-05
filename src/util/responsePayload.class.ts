import { ValidationErrors } from "./errors.type";
import { ResponseMetadata } from "./responseMetadata.class";

export class ResponsePayload<T>  {
    data: T;
    errors: ValidationErrors | null;
    message: string;
    meta: ResponseMetadata;

    constructor() {
        this.data = null;
        this.errors = null;
        this.message = "";
        this.meta = {
            took: 0,
            length: 0,
            total: 0
        };
    }
}
