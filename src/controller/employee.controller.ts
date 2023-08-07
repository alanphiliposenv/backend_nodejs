import express, { NextFunction } from "express";
import EmployeeService from "../service/employee.service";
import { plainToInstance } from "class-transformer";
import EmployeeDto from "../dto/employee.dto";
import { validate } from "class-validator";
import IdDto from "../dto/id.dto";
import ValidationException from "../exceptions/validation.exception";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { Role } from "../util/role.enum";
import { ResponseWithPayload } from "../util/responseWithPayload.interface";
import LoginEmployeeDto from "../dto/loginEmployee.dto";
import UpdateEmployeeDto from "../dto/updateEmployee.dto";
import validation from "../middleware/validation.middleware";
import { RequestWithDTO } from "../util/requestWithDto.util";

class EmployeeController {
    public router: express.Router;

    constructor(
        private employeeService: EmployeeService
    ) {
        this.router = express.Router();

        this.router.get("/", authenticate, this.getAllEmployees);
        this.router.get("/:id", authenticate, validation(IdDto, "params"), this.getEmployeeById);
        this.router.post("/", authenticate, authorize([Role.ADMIN]), validation(EmployeeDto, "body"), this.createEmployee);
        this.router.put("/:id", authenticate, authorize([Role.ADMIN]), validation(IdDto, "params"), validation(EmployeeDto, "body"), this.updateReplaceEmployee);
        this.router.patch("/:id", authenticate, authorize([Role.ADMIN]), validation(IdDto, "params"), validation(UpdateEmployeeDto, "body"), this.updateEmployee);
        this.router.delete("/:id", authenticate, authorize([Role.ADMIN]), validation(IdDto, "params"), this.removeEmployee);
        this.router.post("/login", validation(LoginEmployeeDto, "body"), this.loginEmployee);
    }

    getAllEmployees = async (_req: express.Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const employees = await this.employeeService.getAllEmployees();
            res.status(200).sendPayload("OK", employees, null);
        } catch (error) {
            next(error);
        }
    }

    getEmployeeById = async (req: RequestWithDTO<IdDto, any>, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const employee = await this.employeeService.getEmployeeById(req.params.id);
            res.status(200).sendPayload("OK", employee, null);
        } catch (error) {
            next(error);
        }
    }

    createEmployee = async (req: RequestWithDTO<any, EmployeeDto>, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const createdEmployee = await this.employeeService.createEmployee(req.body);
            res.status(201).sendPayload("OK", createdEmployee, null);
        } catch (error) {
            next(error);
        }
    }

    updateReplaceEmployee = async (req: RequestWithDTO<IdDto, EmployeeDto>, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const updatedEmployee = await this.employeeService.updateReplaceEmployee(req.params.id, req.body);
            res.status(200).sendPayload("OK", updatedEmployee, null);
        } catch (error) {
            next(error);
        }
    }

    updateEmployee = async (req: RequestWithDTO<IdDto, UpdateEmployeeDto>, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const updatedEmployee = await this.employeeService.updateEmployee(req.params.id, req.body);
            res.status(200).sendPayload("OK", updatedEmployee, null);
        } catch (error) {
            next(error);
        }
    }

    removeEmployee = async (req: RequestWithDTO<IdDto, any>, res: ResponseWithPayload, next: NextFunction) => {
        try {
            await this.employeeService.removeEmployee(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    loginEmployee = async (req: RequestWithDTO<IdDto, LoginEmployeeDto>, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const tokenAndEmployeeDetails = await this.employeeService.loginEmployee(req.body);
            res.status(200).sendPayload("OK", tokenAndEmployeeDetails, null);
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;
