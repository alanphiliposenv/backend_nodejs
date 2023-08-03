import { DataSource, Repository } from "typeorm";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
    constructor(
        private employeeRepository: Repository<Employee>
    ) { }

    findAllEmployee(): Promise<Employee[]> {
        return this.employeeRepository.find();
    }

    findOneEmployeeById(id: number): Promise<Employee> {
        return this.employeeRepository.findOneBy({ id: id });
    }

    saveEmployee(newEmployee: Employee): Promise<Employee> {
        return this.employeeRepository.save(newEmployee)
    }

    removeEmployee(newEmployee: Employee): Promise<Employee> {
        return this.employeeRepository.softRemove(newEmployee)
    }
}

export default EmployeeRepository;