import { Request } from "express";

export interface RequestWithDTO<P, B> extends Request {
    params: P | any;
    body: B;
}