import express, { NextFunction, Request, Router } from "express";
import DepartmentService from "../service/department.service";
import authenticateMiddleware from "../middleware/authenticate.middleware";
import authorizeMiddleware from "../middleware/authorize.middleware";
import { ResponseWithPayload } from "../util/responseWithPayload.interface";
import { plainToInstance } from "class-transformer";
import IdDto from "../dto/id.dto";
import { Role } from "../util/role.enum";
import DepartmentDto from "../dto/depaartment.dto";
import { validate } from "class-validator";
import ValidationException from "../exceptions/validation.exception";

class DepartmentController {
    public router: Router;

    constructor(
        private departmentService: DepartmentService
    ) {
        this.router = express.Router();
        this.router.get("/", authenticateMiddleware, this.getAllDepartments);
        this.router.get("/:id", authenticateMiddleware, this.getDepartmentById);
        this.router.post("/", authenticateMiddleware, authorizeMiddleware([Role.ADMIN]), this.createDepartment);
        this.router.put("/:id", authenticateMiddleware, authorizeMiddleware([Role.ADMIN]), this.updateDepartment);
        this.router.delete("/:id", authenticateMiddleware, authorizeMiddleware([Role.ADMIN]), this.removeDepartment);
    }

    getAllDepartments = async (_req: Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const departments = await this.departmentService.getAllDepartments();
            res.status(200).sendPayload("OK", departments, null);;
        } catch (error) {
            next(error);
        }
    }

    getDepartmentById = async (req: Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const idDto = plainToInstance(IdDto, req.params);
            const errors = await validate(idDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            }
            const department = await this.departmentService.getDepartmentById(idDto.id);
            res.status(200).sendPayload("OK", department, null);;
        } catch (error) {
            next(error);
        }

    }

    createDepartment = async (req: Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const departmentDto: DepartmentDto = plainToInstance(DepartmentDto, req.body);
            const errors = await validate(departmentDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            }
            const createdDepartment = await this.departmentService.createDepartment(departmentDto);
            res.status(201).sendPayload("OK", createdDepartment, null);;
        } catch (error) {
            next(error);
        }
    }

    updateDepartment = async (req: Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const idDto = plainToInstance(IdDto, req.params);
            const idErrors = await validate(idDto)
            if (idErrors.length > 0) {
                throw new ValidationException(idErrors);
            }
            const departmentDto: DepartmentDto = plainToInstance(DepartmentDto, req.body);
            const departmentErrors = await validate(departmentDto)
            if (departmentErrors.length > 0) {
                throw new ValidationException(departmentErrors);
            }
            const updatedDepartment = await this.departmentService.updateDepartment(idDto.id, departmentDto);
            res.status(200).sendPayload("OK", updatedDepartment, null);;
        } catch (error) {
            next(error);
        }
    }


    removeDepartment = async (req: Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const idDto = plainToInstance(IdDto, req.params);
            const idErrors = await validate(idDto)
            if (idErrors.length > 0) {
                throw new ValidationException(idErrors);
            }
            const department = await this.departmentService.removeDepartment(idDto.id);
            res.status(200).sendPayload("OK", department, null);
        } catch (error) {
            next(error);
        }
    }
}

export default DepartmentController;
