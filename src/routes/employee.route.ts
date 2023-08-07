import EmployeeController from "../controller/employee.controller";
import dataSource from "../db/postgres.db";
import Department from "../entity/department.entity";
import Employee from "../entity/employee.entity";
import DepartmentRepository from "../repository/department.repository";
import EmployeeRepository from "../repository/employee.repository";
import DepartmentService from "../service/department.service";
import EmployeeService from "../service/employee.service";
import { departmentService } from "./department.route";

const employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee));

const employeeService = new EmployeeService(employeeRepository, departmentService);

const employeeController = new EmployeeController(employeeService);
const employeeRoter = employeeController.router;

export default employeeRoter;
