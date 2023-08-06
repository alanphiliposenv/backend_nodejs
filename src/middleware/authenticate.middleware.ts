import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { jwtPayload } from "../util/jwtPayload.type";
import { RequestWithUser } from "../util/requestWithUser.interface";

function authenticateMiddleware(req: RequestWithUser, _res: Response, next: NextFunction) {
    try {
        const token = getTokenFromRequestHeader(req);
        const payload: jwtPayload = jsonwebtoken.verify(token, process.env.JWT_SECRET) as jwtPayload;
        req.name = payload.name;
        req.username = payload.username;
        req.role = payload.role;
        next();
    } catch (error) {
        next(error);
    }
}

const getTokenFromRequestHeader = (req: Request) => {
    const bearerToken = req.header("Authorization");
    const token = bearerToken ? bearerToken.replace("Bearer ", "") : "";
    return token;
}

export default authenticateMiddleware;
