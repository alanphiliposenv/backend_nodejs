import express, { NextFunction, Request, Router } from "express";
import DepartmentService from "../service/department.service";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { ResponseWithPayload } from "../util/responseWithPayload.interface";
import { plainToInstance } from "class-transformer";
import IdDto from "../dto/id.dto";
import { Role } from "../util/role.enum";
import DepartmentDto from "../dto/depaartment.dto";
import { validate } from "class-validator";
import ValidationException from "../exceptions/validation.exception";
import validation from "../middleware/validation.middleware";
import { RequestWithDTO } from "../util/requestWithDto.util";

class DepartmentController {
    public router: Router;

    constructor(
        private departmentService: DepartmentService
    ) {
        this.router = express.Router();
        this.router.get("/", authenticate, this.getAllDepartments);
        this.router.get("/:id", authenticate, validation(IdDto, "params"), this.getDepartmentById);
        this.router.post("/", authenticate, authorize([Role.ADMIN]), validation(DepartmentDto, "body"), this.createDepartment);
        this.router.put("/:id", authenticate, authorize([Role.ADMIN]), validation(IdDto, "params"), validation(DepartmentDto, "body"), this.updateDepartment);
        this.router.delete("/:id", authenticate, authorize([Role.ADMIN]), validation(IdDto, "params"), this.removeDepartment);
    }

    getAllDepartments = async (_req: Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const departments = await this.departmentService.getAllDepartments();
            res.status(200).sendPayload("OK", departments, null);;
        } catch (error) {
            next(error);
        }
    }

    getDepartmentById = async (req: RequestWithDTO<IdDto, any>, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const department = await this.departmentService.getDepartmentById(req.params.id);
            res.status(200).sendPayload("OK", department, null);;
        } catch (error) {
            next(error);
        }

    }

    createDepartment = async (req: RequestWithDTO<any, DepartmentDto>, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const createdDepartment = await this.departmentService.createDepartment(req.body);
            res.status(201).sendPayload("OK", createdDepartment, null);;
        } catch (error) {
            next(error);
        }
    }

    updateDepartment = async (req: RequestWithDTO<IdDto, DepartmentDto>, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const updatedDepartment = await this.departmentService.updateDepartment(req.params.id, req.body);
            res.status(200).sendPayload("OK", updatedDepartment, null);;
        } catch (error) {
            next(error);
        }
    }


    removeDepartment = async (req: RequestWithDTO<IdDto, any>, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const department = await this.departmentService.removeDepartment(req.params.id);
            res.status(200).sendPayload("OK", department, null);
        } catch (error) {
            next(error);
        }
    }
}

export default DepartmentController;
