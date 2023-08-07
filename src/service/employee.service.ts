import UpdateEmployeeDto from "../dto/employee.dto";
import Employee from "../entity/employee.entity";
import HttpException from "../exceptions/http.exception";
import EmployeeRepository from "../repository/employee.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../util/jwtPayload.type";
import DepartmentService from "./department.service";
import LoginEmployeeDto from "../dto/loginEmployee.dto";
import GetAllEmployeesQueryDto from "../dto/getAllEmployeesQuery.dto";

class EmployeeService {
    constructor(
        private employeeRepository: EmployeeRepository,
        private departmentService: DepartmentService
    ) { }

    getAllEmployees(getAllEmployeesQueryDto: GetAllEmployeesQueryDto): Promise<[Employee[], number]> {
        let page = getAllEmployeesQueryDto.page || 1;
        let take = getAllEmployeesQueryDto.pageSize || 10;
        if (page <= 0) {
            page = 0;
        } else {
            page = page - 1;
        }
        if (take <= 0) {
            take = 10;
        }
        const skip = page*take;
        return this.employeeRepository.findAllEmployees(skip, take);
    }

    async getEmployeeById(id: number): Promise<Employee | null> {
        const employee = await this.employeeRepository.findOneEmployeeById(id);
        if (!employee) {
            throw new HttpException(404, `Employee not Found with id: ${id}`)
        }
        return employee;
    }

    async createEmployee(employeeDto: UpdateEmployeeDto): Promise<Employee> {
        const department = await this.departmentService.getDepartmentById(employeeDto.departmentId);
        if (!department) {
            throw new HttpException(404, "Department not found");
        }

        const newEmployee = new Employee;
        newEmployee.name = employeeDto.name;
        newEmployee.username = employeeDto.username;
        newEmployee.password = await bcrypt.hash(employeeDto.password, 10);
        newEmployee.address = employeeDto.address;
        newEmployee.joiningDate = employeeDto.joiningDate;
        newEmployee.experience = employeeDto.experience;
        newEmployee.role = employeeDto.role;
        newEmployee.departmentId = department.id;

        const employee = await this.employeeRepository.saveEmployee(newEmployee);
        return employee;
    }


    async updateReplaceEmployee(id: number, employeeDto: UpdateEmployeeDto): Promise<Employee | null> {
        const employee = await this.employeeRepository.findOneEmployeeById(id, { address: true });
        if (!employee) {
            throw new HttpException(404, `Employee not Found with id: ${id}`)
        }

        const department = await this.departmentService.getDepartmentById(employeeDto.departmentId);
        if (!department) {
            throw new HttpException(404, "Department not found");
        }

        employee.name = employeeDto.name;
        employee.username = employeeDto.username;
        employee.address = {
            ...employee.address,
            address_line_1: employeeDto.address.address_line_1,
            address_line_2: employeeDto.address.address_line_2,
            city: employeeDto.address.city,
            state: employeeDto.address.state,
            country: employeeDto.address.country,
            pincode: employeeDto.address.pincode,
        };
        employee.role = employeeDto.role;
        employee.experience = employeeDto.experience;
        employee.departmentId = department.id;

        return this.employeeRepository.saveEmployee(employee);
    }

    async updateEmployee(id: number, employeeDto: UpdateEmployeeDto): Promise<Employee | null> {
        const employee = await this.employeeRepository.findOneEmployeeById(id, { address: true });
        if (!employee) {
            throw new HttpException(404, `Employee not Found with id: ${id}`)
        }

        if (employeeDto.departmentId) {
            const department = await this.departmentService.getDepartmentById(employeeDto.departmentId);
            if (!department) {
                throw new HttpException(404, "Department not found");
            }
            employee.departmentId = department.id;
        }

        if (employeeDto.name) {
            employee.name = employeeDto.name;
        }

        if (employeeDto.username) {
            employee.username = employeeDto.username;
        }

        if (employeeDto.role) {
            employee.role = employeeDto.role;
        }

        if (employeeDto.experience) {
            employee.experience = employeeDto.experience;
        }

        if (employeeDto.address) {
            if (employeeDto.address.address_line_1) {
                employee.address.address_line_1 = employeeDto.address.address_line_1;
            }
            if (employeeDto.address.address_line_2) {
                employee.address.address_line_2 = employeeDto.address.address_line_2;
            }
            if (employeeDto.address.city) {
                employee.address.city = employeeDto.address.city;
            }
            if (employeeDto.address.state) {
                employee.address.state = employeeDto.address.state;
            }
            if (employeeDto.address.address_line_1) {
                employee.address.address_line_1 = employeeDto.address.address_line_1;
            }
            if (employeeDto.address.pincode) {
                employee.address.pincode = employeeDto.address.pincode;
            }
        }

        return this.employeeRepository.saveEmployee(employee);
    }

    async removeEmployee(id: number): Promise<void> {
        const employee = await this.employeeRepository.findOneEmployeeById(id);
        if (!employee) {
            throw new HttpException(404, `Employee not Found with id: ${id}`)
        }
        await this.employeeRepository.removeEmployee(employee);
    }

    async loginEmployee(loginEmployeeDto: LoginEmployeeDto): Promise<{ token: string, employeeDetails: Employee }> {
        const employee = await this.employeeRepository.findOneEmployeeByUsername(loginEmployeeDto.username);
        if (!employee) {
            throw new HttpException(401, "Incorrect username or password");
        }
        const result = await bcrypt.compare(loginEmployeeDto.password, employee.password);
        if (!result) {
            throw new HttpException(401, "Incorrect username or password");
        }
        const payload: jwtPayload = {
            name: employee.name,
            username: employee.username,
            role: employee.role,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return { token: token, employeeDetails: employee };
    }
}

export default EmployeeService;
