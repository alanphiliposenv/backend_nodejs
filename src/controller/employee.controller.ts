import express, { NextFunction } from "express";
import EmployeeService from "../service/employee.service";
import { plainToInstance } from "class-transformer";
import EmployeeDto from "../dto/employee.dto";
import { validate } from "class-validator";
import IdDto from "../dto/id.dto";
import ValidationException from "../exceptions/validation.exception";
import authenticateMiddleware from "../middleware/authenticate.middleware";
import authorizeMiddleware from "../middleware/authorize.middleware";
import { Role } from "../util/role.enum";
import { ResponseWithPayload } from "../util/responseWithPayload.interface";

class EmployeeController {
    public router: express.Router;

    constructor(
        private employeeService: EmployeeService
    ) {
        this.router = express.Router();
        this.router.get("/", authenticateMiddleware, this.getAllEmployees);
        this.router.get("/:id", authenticateMiddleware, authorizeMiddleware([Role.HR]), this.getEmployeeById);
        this.router.post("/", authenticateMiddleware, authorizeMiddleware([Role.HR]), this.createEmployee);
        this.router.put("/:id", this.updateEmployee);
        this.router.delete("/:id", this.removeEmployee);
        this.router.post("/login", this.loginEmployee);
    }

    getAllEmployees = async (_req: express.Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const employees = await this.employeeService.getAllEmployees();
            res.status(200).sendPayload("OK", employees, null);
        } catch (error) {
            next(error);
        }
    }

    getEmployeeById = async (req: express.Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const idDto = plainToInstance(IdDto, req.params);
            const errors = await validate(idDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            }
            const employee = await this.employeeService.getEmployeeById(idDto.id);
            res.status(200).sendPayload("OK", employee, null);
        } catch (error) {
            next(error);
        }
    }

    createEmployee = async (req: express.Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const employeeDto = plainToInstance(EmployeeDto, req.body);
            const errors = await validate(employeeDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            }
            const createdEmployee = await this.employeeService.createEmployee(employeeDto);
            res.status(201).sendPayload("OK", createdEmployee, null);
        } catch (error) {
            next(error);
        }
    }

    updateEmployee = async (req: express.Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const idDto = plainToInstance(IdDto, req.params);
            const idErrors = await validate(idDto);
            if (idErrors.length > 0) {
                throw new ValidationException(idErrors);
            }
            const employeeDto = plainToInstance(EmployeeDto, req.body);
            const empErrors = await validate(employeeDto);
            if (empErrors.length > 0) {
                throw new ValidationException(empErrors);
            }
            const updatedEmployee = await this.employeeService.updateEmployee(idDto.id, employeeDto);
            res.status(200).sendPayload("OK", updatedEmployee, null);
        } catch (error) {
            next(error);
        }
    }

    removeEmployee = async (req: express.Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const idDto = plainToInstance(IdDto, req.params);
            const errors = await validate(idDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            }
            await this.employeeService.removeEmployee(idDto.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    loginEmployee = async (req: express.Request, res: ResponseWithPayload, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const tokenAndEmployeeDetails = await this.employeeService.loginEmployee(email, password);
            res.status(200).sendPayload("OK", tokenAndEmployeeDetails, null);
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;
