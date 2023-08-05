import DepartmentController from "../controller/department.controller";
import dataSource from "../db/postgres.db";
import Department from "../entity/department.entity";
import DepartmentRepository from "../repository/department.repository";
import DepartmentService from "../service/department.service";

const departRepository = new DepartmentRepository(dataSource.getRepository(Department));

const departmentService = new DepartmentService(departRepository);

const departmentController = new DepartmentController(departmentService);
const departmentRouter = departmentController.router;

export default departmentRouter;
