import { FindOptionsRelations, Repository } from "typeorm";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
    constructor(
        private employeeRepository: Repository<Employee>
    ) { }

    findAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.find();
    }

    findOneEmployeeById(id: number, relations?: FindOptionsRelations<Employee>): Promise<Employee> {
        return this.employeeRepository.findOne({
            where: {
                id: id,
            },
            relations
        });
    }

    findOneEmployeeByUsername(username: string): Promise<Employee> {
        return this.employeeRepository.findOne({
            where: {
                username
            },
        });
    }

    saveEmployee(newEmployee: Employee): Promise<Employee> {
        return this.employeeRepository.save(newEmployee)
    }

    removeEmployee(newEmployee: Employee): Promise<Employee> {
        return this.employeeRepository.softRemove(newEmployee)
    }
}

export default EmployeeRepository;
