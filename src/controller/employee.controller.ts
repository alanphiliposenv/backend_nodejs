import express, { NextFunction } from "express";
import EmployeeService from "../service/employee.service";
import { plainToInstance } from "class-transformer";
import EmployeeDto from "../dto/employee.dto";
import { validate } from "class-validator";
import IdDto from "../dto/id.dto";
import ValidationException from "../exceptions/validation.exception";

class EmployeeController {
    public router: express.Router;

    constructor(
        private employeeService: EmployeeService
    ) {
        this.router = express.Router();

        this.router.get("/", this.getAllEmployees);
        this.router.get("/:id", this.getEmployeeById);
        this.router.post("/", this.createEmployee);
        this.router.put("/:id", this.updateEmployee);
        this.router.delete("/:id", this.removeEmployee);
    }

    getAllEmployees = async (req: express.Request, res: express.Response) => {
        const employees = await this.employeeService.getAllEmployees();
        res.status(200).send(employees);
    }

    getEmployeeById = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const idDto = plainToInstance(IdDto, req.params);
            const errors = await validate(idDto);
            if (errors.length > 0) {
                throw new ValidationException(400, "Validation Error", errors);
            }
            const employee = await this.employeeService.getEmployeeById(idDto.id);
            res.status(200).send(employee);
        } catch (error) {
            next(error);
        }
    }

    createEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeDto = plainToInstance(EmployeeDto, req.body);
            const errors = await validate(employeeDto);
            if (errors.length > 0) {
                throw new ValidationException(400, "Validation Error", errors);
            }
            const createdEmployee = await this.employeeService.createEmployee(
                employeeDto.name,
                employeeDto.email,
                employeeDto.address
            );
            res.status(201).send(createdEmployee);
        } catch (error) {
            next(error);
        }
    }

    updateEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const idDto = plainToInstance(IdDto, req.params);
            const idErrors = await validate(idDto);
            if (idErrors.length > 0) {
                throw new ValidationException(400, "Validation Error", idErrors);
            }
            const employeeDto = plainToInstance(EmployeeDto, req.body);
            const empErrors = await validate(employeeDto);
            if (empErrors.length > 0) {
                throw new ValidationException(400, "Validation Error", empErrors);
            }
            const updatedEmployee = await this.employeeService.updateEmployee(
                idDto.id,
                employeeDto.name,
                employeeDto.email,
                employeeDto.address
            );
            res.status(200).send(updatedEmployee);
        } catch (error) {
            next(error);
        }
    }

    removeEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const idDto = plainToInstance(IdDto, req.params);
            const errors = await validate(idDto);
            if (errors.length > 0) {
                throw new ValidationException(400, "Validation Error", errors);
            }
            await this.employeeService.removeEmployee(idDto.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;
