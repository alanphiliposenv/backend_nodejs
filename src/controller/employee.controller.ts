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
import LoginEmployeeDto from "../dto/loginEmployee.dto";
import UpdateEmployeeDto from "../dto/updateEmployee.dto";

class EmployeeController {
    public router: express.Router;

    constructor(
        private employeeService: EmployeeService
    ) {
        this.router = express.Router();

        this.router.get("/", authenticateMiddleware, this.getAllEmployees);
        this.router.get("/:id", authenticateMiddleware, this.getEmployeeById);
        this.router.post("/",  authenticateMiddleware, authorizeMiddleware([Role.ADMIN]), this.createEmployee);
        this.router.put("/:id", authenticateMiddleware, authorizeMiddleware([Role.ADMIN]), this.updateReplaceEmployee);
        this.router.patch("/:id", authenticateMiddleware, authorizeMiddleware([Role.ADMIN]), this.updateEmployee);
        this.router.delete("/:id", authenticateMiddleware, authorizeMiddleware([Role.ADMIN]), this.removeEmployee);
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

    updateReplaceEmployee = async (req: express.Request, res: ResponseWithPayload, next: NextFunction) => {
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
            const updatedEmployee = await this.employeeService.updateReplaceEmployee(idDto.id, employeeDto);
            res.status(200).sendPayload("OK", updatedEmployee, null);
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
            const updateEmployeeDto = plainToInstance(UpdateEmployeeDto, req.body);
            const empErrors = await validate(updateEmployeeDto);
            if (empErrors.length > 0) {
                throw new ValidationException(empErrors);
            }
            const updatedEmployee = await this.employeeService.updateEmployee(idDto.id, updateEmployeeDto);
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
            const loginEmployeeDto = plainToInstance(LoginEmployeeDto, req.body);
            const errors = await validate(loginEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            }
            const tokenAndEmployeeDetails = await this.employeeService.loginEmployee(loginEmployeeDto);
            res.status(200).sendPayload("OK", tokenAndEmployeeDetails, null);
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;
