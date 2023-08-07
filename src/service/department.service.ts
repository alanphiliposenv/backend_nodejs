import DepartmentDto from "../dto/depaartment.dto";
import Department from "../entity/department.entity";
import HttpException from "../exceptions/http.exception";
import DepartmentRepository from "../repository/department.repository";

class DepartmentService {
    constructor(
        private departmentRepository: DepartmentRepository
    ) {}

    getAllDepartments(): Promise<Department[]> {
        return this.departmentRepository.findAllDepartments();
    }

    async getDepartmentById(id: number): Promise<Department> {
        const department = await this.departmentRepository.findOneDepartmentById(id);
        if (!department) {
            throw new HttpException(404, "Department not found");
        }
        return department;
    }

    createDepartment(departmentDto: DepartmentDto): Promise<Department> {
        const department = new Department();
        department.name = departmentDto.name;
        return this.departmentRepository.saveDepartment(department);
    }

    async updateDepartment(id: number, departmentDto: DepartmentDto): Promise<Department> {
        const department = await this.departmentRepository.findOneDepartmentById(id);
        if (!department) {
            throw new HttpException(404, "Department not found");
        }
        department.name = departmentDto.name;
        return this.departmentRepository.saveDepartment(department);
    }

    async removeDepartment(id: number): Promise<Department> {
        const department = await this.departmentRepository.findOneDepartmentById(id, {
            employees: true
        });
        if (!department) {
            throw new HttpException(404, "Department not found");
        }
        if (department.employees.length > 0) {
            throw new HttpException(400, "Employees present in Deparment");
        }
        return this.departmentRepository.removeDepartment(department);
    }
}

export default DepartmentService;
