import express from "express";
import EmployeeService from "../service/employee.service";

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

    getEmployeeById = async (req: express.Request, res: express.Response) => {
        const id: number = Number(req.params.id);
        const employee = await this.employeeService.getEmployeeById(id);
        res.status(200).send(employee);
    }

    createEmployee = async (req: express.Request, res: express.Response) => {
        const name: string = req.body.name;
        const email: string = req.body.email;
        const createdEmployee = await this.employeeService.createEmployee(name, email);
        res.status(201).send(createdEmployee);
    }


    updateEmployee = async (req: express.Request, res: express.Response) => {
        const id: number = Number(req.params.id);
        const name: string = req.body.name;
        const email: string = req.body.email;
        const updatedEmployee = await this.employeeService.updateEmployee(id, name, email);
        res.status(200).send(updatedEmployee);
    }

    removeEmployee = async (req: express.Request, res: express.Response) => {
        const id: number = Number(req.params.id);
        if (await this.employeeService.removeEmployee(id)) {
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    }
}

export default EmployeeController;