import express, { NextFunction, Request, Router } from "express";
import { ResponseWithPayload } from "../util/responseWithPayload.interface";
import RoleService from "../service/role.service";
import authenticateMiddleware from "../middleware/authenticate.middleware";

class RoleController {
    public router: Router;

    constructor(
        private roleService: RoleService
    ) {
        this.router = express.Router();
        this.roleService = new RoleService();

        this.router.get("/", authenticateMiddleware, this.getAllRoles);
    }

    getAllRoles = (_req: Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const roles = this.roleService.getAllRoles();
            res.status(200).sendPayload("OK", roles, null);;
        } catch (error) {
            next(error);
        }
    }
}

export default RoleController;
