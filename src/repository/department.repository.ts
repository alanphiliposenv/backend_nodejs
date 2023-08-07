import { FindOptionsRelations, Repository } from "typeorm";
import Department from "../entity/department.entity";

class DepartmentRepository {
    constructor(
        private departmentRepository: Repository<Department>
    ) {}

    findAllDepartments(): Promise<Department[]> {
        return this.departmentRepository.find();
    }

    findOneDepartmentById(id: number, relations?: FindOptionsRelations<Department>): Promise<Department> {
        return this.departmentRepository.findOne({
            where: {
                id
            },
            relations,
        });
    }

    saveDepartment(department: Department): Promise<Department> {
        return this.departmentRepository.save(department);
    }

    removeDepartment(department: Department): Promise<Department> {
        return this.departmentRepository.softRemove(department);
    }
}

export default DepartmentRepository;
