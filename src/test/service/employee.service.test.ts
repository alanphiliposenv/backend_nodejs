import { DataSource } from "typeorm";
import EmployeeRepository from "../../repository/employee.repository";
import EmployeeService from "../../service/employee.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import HttpException from "../../exceptions/http.exception";

describe("Employee service tests", () => {
    let employeeService: EmployeeService;
    let employeeRepository: EmployeeRepository;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;
        employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee));
        employeeService = new EmployeeService(employeeRepository);
    });

    describe("Test for getEmployeeById", () => {
        test("Test employee for id 1", async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValueOnce({ id: 1, name: "abc" });
            employeeRepository.findOneEmployeeById = mockFunction;
            const employee = await employeeService.getEmployeeById(1);
            expect(employee).toStrictEqual({ id: 1, name: "abc" });
        });
        test("Test employee for id 2", async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(2).mockResolvedValueOnce(null);
            employeeRepository.findOneEmployeeById = mockFunction;
            expect(async () => await employeeService.getEmployeeById(2)).rejects.toThrow(HttpException);
        });
    });
});