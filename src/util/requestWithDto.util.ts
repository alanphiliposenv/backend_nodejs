import { Request } from "express";

export interface RequestWithDTO<P = any, B = any, Q = any> extends Request {
    params: P | any;
    body: B;
    query: Q | any;
}