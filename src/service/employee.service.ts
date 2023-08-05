import EmployeeDto from "../dto/employee.dto";
import Employee from "../entity/employee.entity";
import HttpException from "../exceptions/http.exception";
import EmployeeRepository from "../repository/employee.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../util/jwtPayload.type";
import DepartmentService from "./department.service";

class EmployeeService {
    constructor(
        private employeeRepository: EmployeeRepository,
        private departmentService: DepartmentService
    ) { }

    getAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.findAllEmployee();
    }

    async getEmployeeById(id: number): Promise<Employee | null> {
        const employee = await this.employeeRepository.findOneEmployeeById(id);
        if (!employee) {
            throw new HttpException(404, `Employee not Found with id: ${id}`)
        }
        return employee;
    }

    async createEmployee(employeeDto: EmployeeDto): Promise<Employee> {
        const department = await this.departmentService.getDepartmentById(employeeDto.departmentId);
        if (!department) {
            throw new HttpException(404, "Department not found");
        }

        const newEmployee = new Employee;
        newEmployee.name = employeeDto.name;
        newEmployee.email = employeeDto.email;
        newEmployee.password = await bcrypt.hash(employeeDto.password, 10);
        newEmployee.address = employeeDto.address;
        newEmployee.role = employeeDto.role;
        newEmployee.departmentId = department.id;

        return this.employeeRepository.saveEmployee(newEmployee);
    }


    async updateEmployee(id: number, employeeDto: EmployeeDto): Promise<Employee | null> {
        const employee = await this.employeeRepository.findOneEmployeeById(id, { address: true });
        if (!employee) {
            throw new HttpException(404, `Employee not Found with id: ${id}`)
        }

        const department = await this.departmentService.getDepartmentById(employeeDto.departmentId);
        if (!department) {
            throw new HttpException(404, "Department not found");
        }

        employee.name = employeeDto.name;
        employee.email = employeeDto.email;
        employee.address.line1 = employeeDto.address.line1;
        employee.address.pincode = employeeDto.address.pincode;
        employee.role = employeeDto.role;
        employee.departmentId = department.id;

        return this.employeeRepository.saveEmployee(employee);
    }

    async removeEmployee(id: number): Promise<void> {
        const employee = await this.employeeRepository.findOneEmployeeById(id);
        if (!employee) {
            throw new HttpException(404, `Employee not Found with id: ${id}`)
        }
        await this.employeeRepository.removeEmployee(employee);
    }

    async loginEmployee(email: string, password: string): Promise<{ token: string, employeeDetails: Employee }> {
        const employee = await this.employeeRepository.findOneEmployeeByEmail(email);
        if (!employee) {
            throw new HttpException(401, "Incorrect email or password");
        }
        const result = await bcrypt.compare(password, employee.password);
        if (!result) {
            throw new HttpException(401, "Incorrect email or password");
        }
        const payload: jwtPayload = {
            name: employee.name,
            email: employee.email,
            role: employee.role,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return { token: token, employeeDetails: employee };
    }
}

export default EmployeeService;
