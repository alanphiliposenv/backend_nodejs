import Employee from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";

class EmployeeService {
    constructor(
        private employeeRepository: EmployeeRepository
    ) { }

    getAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.findAllEmployee();
    }

    getEmployeeById(id: number): Promise<Employee | null> {
        return this.employeeRepository.findOneEmployeeById(id);
    }

    createEmployee(name: string, email: string): Promise<Employee> {
        const newEmployee = new Employee;
        newEmployee.name = name;
        newEmployee.email = email;
        return this.employeeRepository.saveEmployee(newEmployee);
    }


    async updateEmployee(id: number, name: string, email: string): Promise<Employee | null> {
        const employee = await this.employeeRepository.findOneEmployeeById(id);
        if (!employee) {
            return null;
        }
        employee.name = name;
        employee.email = email;
        return this.employeeRepository.saveEmployee(employee);
    }

    async removeEmployee(id: number): Promise<boolean | void> {
        const employee = await this.employeeRepository.findOneEmployeeById(id);
        if (!employee) {
            return false;
        }
        await this.employeeRepository.removeEmployee(employee);
        return true;
    }
}

export default EmployeeService;