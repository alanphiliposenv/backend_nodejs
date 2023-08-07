import { DataSource } from "typeorm";
import EmployeeRepository from "../../repository/employee.repository";
import EmployeeService from "../../service/employee.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import HttpException from "../../exceptions/http.exception";
import DepartmentService from "../../service/department.service";
import DepartmentRepository from "../../repository/department.repository";
import Department from "../../entity/department.entity";
import EmployeeDto from "../../dto/employee.dto";
import { Role } from "../../util/role.enum";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import LoginEmployeeDto from "../../dto/loginEmployee.dto";
import UpdateEmployeeDto from "../../dto/updateEmployee.dto";
import GetAllEmployeesQueryDto from "../../dto/getAllEmployeesQuery.dto";

describe("Employee Service Tests", () => {
    let employeeService: EmployeeService;
    let employeeRepository: EmployeeRepository;
    let departmentService: DepartmentService;
    const sampleEmployees = [
        {
            "createdAt": "2022-10-04T05:34:26.315Z",
            "updatedAt": "2022-10-04T05:36:21.808Z",
            "deletedAt": null,
            "id": "1b5368d2-1cbd-4a28-a275-38670b56b846",
            "name": "amal",
            "username": "ama",
            "password": "$2b$10$S9uZH54.S3HBHDjcKLvEt.wIhGTgw4wQnBQumcdMTRY0XC1nTSwpi",
            "joiningDate": "11/02/2012",
            "isActive": true,
            "experience": 8,
            "departmentId": 2,
            "role": "admin"
        },
        {
            "createdAt": "2022-10-04T08:23:49.661Z",
            "updatedAt": "2022-10-04T08:23:49.661Z",
            "deletedAt": null,
            "id": "1af769f7-b34e-4da8-837d-7350ec32e5eb",
            "name": "malathy",
            "username": "mal",
            "password": "$2b$10$adSMa/0K4b0X1ZUg/EjX/eVafRF3NoK3A0vNINHtRb3Vu0CIq4wiS",
            "joiningDate": "11/02/2012",
            "isActive": true,
            "experience": 8,
            "departmentId": 2,
            "role": "user"
        },
        {
            "createdAt": "2022-10-04T08:58:29.669Z",
            "updatedAt": "2022-10-04T08:58:29.669Z",
            "deletedAt": null,
            "id": "191a2c85-604f-4b5d-a2d1-5243a3b38a8f",
            "name": "Ashok",
            "username": "ash",
            "password": "$2b$10$BaPO4JD98lPNi6yDxpNTX.d30gZlyslAATuo/8ZwupTmlg7pA1LWa",
            "joiningDate": "11/02/2012",
            "isActive": true,
            "experience": 8,
            "departmentId": 2,
            "role": "admin"
        }
    ]


    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

        employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee));
        departmentService = new DepartmentService(new DepartmentRepository(dataSource.getRepository(Department)));
        employeeService = new EmployeeService(employeeRepository, departmentService);
    });

    describe("Test for getAllEmployees", () => {
        test("Test with no page and pageSize", () => {
            const inputDto = {} as GetAllEmployeesQueryDto;
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0, 10).mockResolvedValueOnce([sampleEmployees, 20]);
            employeeRepository.findAllEmployees = mockFunction;
            expect(employeeService.getAllEmployees(inputDto)).resolves.toStrictEqual([sampleEmployees, 20]);
        });
        test("Test with only page", () => {
            const inputDto = {
                page: 2,
            } as GetAllEmployeesQueryDto;
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(10, 10).mockResolvedValueOnce([sampleEmployees, 20]);
            employeeRepository.findAllEmployees = mockFunction;
            expect(employeeService.getAllEmployees(inputDto)).resolves.toStrictEqual([sampleEmployees, 20]);
        });
        test("Test with only pageSize", () => {
            const inputDto = {
                pageSize: 2,
            } as GetAllEmployeesQueryDto;
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0, 2).mockResolvedValueOnce(sampleEmployees);
            employeeRepository.findAllEmployees = mockFunction;
            expect(employeeService.getAllEmployees(inputDto)).resolves.toEqual(sampleEmployees);
        });
        test("Test with page and pageSize", () => {
            const inputDto = {
                page: 3,
                pageSize: 2,
            } as GetAllEmployeesQueryDto;
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(4, 2).mockResolvedValueOnce(sampleEmployees);
            employeeRepository.findAllEmployees = mockFunction;
            expect(employeeService.getAllEmployees(inputDto)).resolves.toEqual(sampleEmployees);
        });
        test("Test with zero page and pageSize", () => {
            const inputDto = {
                page: 0,
                pageSize: 0,
            } as GetAllEmployeesQueryDto;
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0, 10).mockResolvedValueOnce(sampleEmployees);
            employeeRepository.findAllEmployees = mockFunction;
            expect(employeeService.getAllEmployees(inputDto)).resolves.toEqual(sampleEmployees);
        });
        test("Test with negative page and pageSize", () => {
            const inputDto = {
                page: -3,
                pageSize: -2,
            } as GetAllEmployeesQueryDto;
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0, 10).mockResolvedValueOnce(sampleEmployees);
            employeeRepository.findAllEmployees = mockFunction;
            expect(employeeService.getAllEmployees(inputDto)).resolves.toEqual(sampleEmployees);
        });
    });

    describe("Test for getEmployeeById", () => {
        const id = 1;
        test("Test invalid id", () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(id).mockResolvedValueOnce(null);
            employeeRepository.findOneEmployeeById = mockFunction;
            expect(employeeService.getEmployeeById(id)).rejects.toThrow(HttpException);
        });
        test("Test valid id", async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(id).mockResolvedValueOnce(sampleEmployees[0]);
            employeeRepository.findOneEmployeeById = mockFunction;
            expect(employeeService.getEmployeeById(id)).resolves.toStrictEqual(sampleEmployees[0]);
        });
    });

    describe("Test for createEmployee", () => {
        const mockSaveEmployee = jest.fn();
        const mockFindOOneDepartmentById = jest.fn();
        const mockBcryptHash = jest.fn();
        const inputDto = {
            name: "test",
            username: "test",
            password: "password",
            joiningDate: "11/02/2012",
            experience: 8,
            departmentId: 2,
            role: Role.USER,
            address: {
                address_line_1: "ABC",
                address_line_2: "PQR",
                city: "Ernakulam",
                state: "Kerala",
                country: "India",
                pincode: "682024"
            }
        } as EmployeeDto;

        beforeEach(() => {
            when(mockBcryptHash).calledWith("password", 10).mockResolvedValueOnce("hashedPassword");
            bcrypt.hash = mockBcryptHash;
        });

        test("Test create employee with invalid department id", () => {
            when(mockFindOOneDepartmentById).calledWith(inputDto.departmentId).mockResolvedValueOnce(null);
            departmentService.getDepartmentById = mockFindOOneDepartmentById;
            expect(employeeService.createEmployee(inputDto)).rejects.toThrow(HttpException);
        });
        test("Test create employee with valid department id", () => {
            when(mockFindOOneDepartmentById).calledWith(inputDto.departmentId).mockResolvedValueOnce({
                id: inputDto.departmentId,
                name: "HR",
            });
            departmentService.getDepartmentById = mockFindOOneDepartmentById;
            when(mockSaveEmployee).calledWith({
                ...inputDto,
                password: "hashedPassword"
            }).mockResolvedValueOnce({
                ...inputDto,
                password: "hashedPassword"
            });
            employeeRepository.saveEmployee = mockSaveEmployee;
            expect(employeeService.createEmployee(inputDto)).resolves.toStrictEqual({
                ...inputDto,
                password: "hashedPassword"
            });
        });

    });

    describe("Test for updateEmployee", () => {
        const id = 1;
        const mockSoftUpdateEmployee = jest.fn();
        let inputDto: UpdateEmployeeDto = {
            name: "test",
            username: "test",
            password: "password",
            joiningDate: "11/02/2012",
            experience: 8,
            departmentId: 2,
            role: Role.USER,
            address: {
                address_line_1: "ABC",
                address_line_2: "PQR",
                city: "Ernakulam",
                state: "Kerala",
                country: "India",
                pincode: "682024"
            }
        } as UpdateEmployeeDto;

        beforeEach(() => {
            when(mockSoftUpdateEmployee).calledWith(inputDto).mockResolvedValueOnce(inputDto);
            employeeRepository.saveEmployee = mockSoftUpdateEmployee;
        });
        const mockFindOOneEmployeeById = jest.fn();
        const mockGetDeparmentById = jest.fn();

        test("Test invalid employee id", () => {
            when(mockFindOOneEmployeeById).calledWith(id, { address: true }).mockResolvedValueOnce(null);
            employeeRepository.findOneEmployeeById = mockFindOOneEmployeeById;
            expect(employeeService.updateEmployee(id, inputDto)).rejects.toThrow(HttpException);
        });

        test("Test invalid department id", () => {
            when(mockFindOOneEmployeeById).calledWith(id, { address: true }).mockResolvedValueOnce(inputDto);
            employeeRepository.findOneEmployeeById = mockFindOOneEmployeeById;
            when(mockGetDeparmentById).calledWith(inputDto.departmentId).mockResolvedValueOnce(null);
            departmentService.getDepartmentById = mockGetDeparmentById;
            expect(employeeService.updateEmployee(id, inputDto)).rejects.toThrow(HttpException);
        });

        test("Test successful employee update", () => {
            when(mockFindOOneEmployeeById).calledWith(id, { address: true }).mockResolvedValueOnce(inputDto);
            employeeRepository.findOneEmployeeById = mockFindOOneEmployeeById;
            when(mockGetDeparmentById).calledWith(inputDto.departmentId).mockResolvedValueOnce({
                id: inputDto.departmentId,
                name: "Backend Engineering"
            });
            departmentService.getDepartmentById = mockGetDeparmentById;
            expect(employeeService.updateEmployee(id, inputDto)).resolves.toEqual(inputDto);
        });

    });

    describe("Test for updateReplaceEmployee", () => {
        const id = 1;
        const mockUpdateEmployee = jest.fn();
        let inputDto: EmployeeDto = {
            name: "test",
            username: "test",
            password: "password",
            joiningDate: "11/02/2012",
            experience: 8,
            departmentId: 2,
            role: Role.USER,
            address: {
                address_line_1: "ABC",
                address_line_2: "PQR",
                city: "Ernakulam",
                state: "Kerala",
                country: "India",
                pincode: "682024"
            }
        } as EmployeeDto;

        beforeEach(() => {
            when(mockUpdateEmployee).calledWith(inputDto).mockResolvedValueOnce(inputDto);
            employeeRepository.saveEmployee = mockUpdateEmployee;
        });
        const mockFindOOneEmployeeById = jest.fn();
        const mockGetDeparmentById = jest.fn();

        test("Test invalid employee id", () => {
            when(mockFindOOneEmployeeById).calledWith(id, { address: true }).mockResolvedValueOnce(null);
            employeeRepository.findOneEmployeeById = mockFindOOneEmployeeById;
            expect(employeeService.updateReplaceEmployee(id, inputDto)).rejects.toThrow(HttpException);
        });

        test("Test invalid department id", () => {
            when(mockFindOOneEmployeeById).calledWith(id, { address: true }).mockResolvedValueOnce(inputDto);
            employeeRepository.findOneEmployeeById = mockFindOOneEmployeeById;
            when(mockGetDeparmentById).calledWith(inputDto.departmentId).mockResolvedValueOnce(null);
            departmentService.getDepartmentById = mockGetDeparmentById;
            expect(employeeService.updateReplaceEmployee(id, inputDto)).rejects.toThrow(HttpException);
        });

        test("Test successful employee update", () => {
            when(mockFindOOneEmployeeById).calledWith(id, { address: true }).mockResolvedValueOnce(inputDto);
            employeeRepository.findOneEmployeeById = mockFindOOneEmployeeById;
            when(mockGetDeparmentById).calledWith(inputDto.departmentId).mockResolvedValueOnce({
                id: inputDto.departmentId,
                name: "Backend Engineering"
            });
            departmentService.getDepartmentById = mockGetDeparmentById;
            expect(employeeService.updateReplaceEmployee(id, inputDto)).resolves.toEqual(inputDto);
        });

    });

    describe("Test for removeEmployee", () => {
        const id = 1;
        const mockSoftRemoveEmployee = jest.fn();
        beforeEach(() => {
            when(mockSoftRemoveEmployee).calledWith(sampleEmployees[0]).mockResolvedValueOnce(sampleEmployees[0]);
            employeeRepository.removeEmployee = mockSoftRemoveEmployee;
        });
        const mockFindOOneEmployeeById = jest.fn();

        test("Test invalid id", () => {
            when(mockFindOOneEmployeeById).calledWith(id).mockResolvedValueOnce(null);
            employeeRepository.findOneEmployeeById = mockFindOOneEmployeeById;
            expect(employeeService.removeEmployee(id)).rejects.toThrow(HttpException);
        });

        test("Test valid id", () => {
            when(mockFindOOneEmployeeById).calledWith(id).mockResolvedValueOnce(sampleEmployees[0]);
            employeeRepository.findOneEmployeeById = mockFindOOneEmployeeById;
            expect(employeeService.removeEmployee(id)).resolves
        });

    });

    describe("Test for loginEmployee", () => {
        const inputDto: LoginEmployeeDto = {
            username: "user1",
            password: "password1"
        }
        const mockBcryptCompare = jest.fn();
        const mockJwtSign = jest.fn();
        const mockFindOOneEmployeeByUsername = jest.fn();

        const sampleEmployee = {
            ...sampleEmployees[0],
            password: "hashedPassword"
        };

        beforeEach(() => {
            when(mockJwtSign).calledWith({
                name: sampleEmployee.name,
                username: sampleEmployee.username,
                role: sampleEmployee.role,
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }).mockReturnValueOnce("newToken");
            jwt.sign = mockJwtSign;
        });

        test("Test invalid username", () => {
            when(mockFindOOneEmployeeByUsername).calledWith(inputDto.username).mockResolvedValueOnce(null);
            employeeRepository.findOneEmployeeByUsername = mockFindOOneEmployeeByUsername;
            expect(employeeService.loginEmployee(inputDto)).rejects.toThrow(HttpException)
        });

        test("Test invalid password", () => {
            when(mockFindOOneEmployeeByUsername).calledWith(inputDto.username).mockResolvedValueOnce(sampleEmployee);
            employeeRepository.findOneEmployeeByUsername = mockFindOOneEmployeeByUsername;
            when(mockBcryptCompare).calledWith(inputDto.password, "hashedPassword").mockResolvedValueOnce(false);
            bcrypt.compare = mockBcryptCompare;
            expect(employeeService.loginEmployee(inputDto)).rejects.toThrow(HttpException)
        });

        test("Test valid username and password", () => {
            when(mockFindOOneEmployeeByUsername).calledWith(inputDto.username).mockResolvedValueOnce(sampleEmployee);
            employeeRepository.findOneEmployeeByUsername = mockFindOOneEmployeeByUsername;
            when(mockBcryptCompare).calledWith(inputDto.password, "hashedPassword").mockResolvedValueOnce(true);
            bcrypt.compare = mockBcryptCompare;
            expect(employeeService.loginEmployee(inputDto)).resolves.toStrictEqual({
                token: "newToken",
                employeeDetails: sampleEmployee
            });
        });

    });

});
