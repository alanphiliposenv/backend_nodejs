import Employee from "../entity/employee.entity";
import HttpException from "../exceptions/http.exception";
import EmployeeRepository from "../repository/employee.repository";

class EmployeeService {
    constructor(
        private employeeRepository: EmployeeRepository
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

    createEmployee(name: string, email: string, address: any): Promise<Employee> {
        const newEmployee = new Employee;
        newEmployee.name = name;
        newEmployee.email = email;
        newEmployee.address = address;
        return this.employeeRepository.saveEmployee(newEmployee);
    }


    async updateEmployee(id: number, name: string, email: string, address: any): Promise<Employee | null> {
        const employee = await this.employeeRepository.findOneEmployeeById(id);
        if (!employee) {
            throw new HttpException(404, `Employee not Found with id: ${id}`)
        }
        employee.name = name;
        employee.email = email;
        employee.address.line1 = address.line1;
        employee.address.pincode = address.pincode;
        return this.employeeRepository.saveEmployee(employee);
    }

    async removeEmployee(id: number): Promise<void> {
        const employee = await this.employeeRepository.findOneEmployeeById(id);
        if (!employee) {
            throw new HttpException(404, `Employee not Found with id: ${id}`)
        }
        await this.employeeRepository.removeEmployee(employee);
    }
}

export default EmployeeService;
