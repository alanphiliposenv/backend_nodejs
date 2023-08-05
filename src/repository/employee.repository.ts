import { FindOptionsRelations, Repository } from "typeorm";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
    constructor(
        private employeeRepository: Repository<Employee>
    ) { }

    findAllEmployee(): Promise<Employee[]> {
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

    findOneEmployeeByEmail(email: string): Promise<Employee> {
        return this.employeeRepository.findOne({
            where: {
                email: email
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
