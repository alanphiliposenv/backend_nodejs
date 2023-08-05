import { NextFunction, RequestHandler, Response } from "express";
import { RequestWithUser } from "../util/requestWithUser.interface";
import HttpException from "../exceptions/http.exception";
import { Role } from "../util/role.enum";

function authorizeMiddlerware(roles: Role[]): RequestHandler {
    return (req: RequestWithUser, _res: Response, next: NextFunction) => {
        try {
            const role = req.role;
            if (roles.indexOf(role) === -1) {
                throw new HttpException(403, "Not authorized");
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default authorizeMiddlerware;
