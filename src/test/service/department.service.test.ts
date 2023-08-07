import { DataSource } from "typeorm";
import { when } from "jest-when";
import DepartmentService from "../../service/department.service";
import DepartmentRepository from "../../repository/department.repository";
import Department from "../../entity/department.entity";
import HttpException from "../../exceptions/http.exception";
import DepartmentDto from "../../dto/depaartment.dto";

describe("Department Service Tests", () => {
    let departmentService: DepartmentService;
    let departmentRepository: DepartmentRepository;
    let sampleDepartments = [
        {
            id: 5,
            createdAt: "2023-08-06T07:38:33.846Z",
            updatedAt: "2023-08-06T07:38:33.846Z",
            deletedAt: null,
            name: "Hr"
        },
        {
            id: 6,
            createdAt: "2023-08-06T09:51:22.149Z",
            updatedAt: "2023-08-06T09:51:22.149Z",
            deletedAt: null,
            name: "Backend Engineering"
        },
        {
            id: 7,
            createdAt: "2023-08-06T09:52:58.674Z",
            updatedAt: "2023-08-06T09:52:58.674Z",
            deletedAt: null,
            name: "Frontend Engineering"
        }
    ]

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;
        departmentRepository = new DepartmentRepository(dataSource.getRepository(Department));
        departmentService = new DepartmentService(departmentRepository);
    });

    describe("Test for getAllDepartments", () => {
        test("Test 0 departments", () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith().mockResolvedValueOnce([]);
            departmentRepository.findAllDepartments = mockFunction;
            expect(departmentService.getAllDepartments()).resolves.toEqual([]);
        });
        test("Test n departments", () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith().mockResolvedValueOnce(sampleDepartments);
            departmentRepository.findAllDepartments = mockFunction;
            expect(departmentService.getAllDepartments()).resolves.toEqual(sampleDepartments);
        });

    });

    describe("Test for getDepartmentById", () => {
        test("Test with invalid id", () => {
            const id = 1;
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(id).mockResolvedValueOnce(null);
            departmentRepository.findOneDepartmentById = mockFunction;
            expect(departmentService.getDepartmentById(id)).rejects.toThrow(HttpException);
        });
        test("Test with valid id", () => {
            const id = 1;
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(id).mockResolvedValueOnce(sampleDepartments[0]);
            departmentRepository.findOneDepartmentById = mockFunction;
            expect(departmentService.getDepartmentById(id)).resolves.toStrictEqual(sampleDepartments[0]);;
        });
    });

    describe("Test for createDepartment", () => {
        test("Test create department", () => {
            const mockFunction = jest.fn();
            const inputDto: DepartmentDto = {
                name: "Backend Engineering",
            }
            when(mockFunction).calledWith(inputDto).mockResolvedValueOnce(sampleDepartments[0]);
            departmentRepository.saveDepartment = mockFunction;
            expect(departmentService.createDepartment(inputDto)).resolves.toStrictEqual(sampleDepartments[0]);
        });
    });

    describe("Test for updateDepartment", () => {
        const id = 1;
        const inputDto: DepartmentDto = {
            name: "Backend Engineering",
        }
        const mockFindOOneDepartmentById = jest.fn();
        const mockSaveDepartment = jest.fn();
        beforeEach(() => {
            when(mockSaveDepartment).calledWith(inputDto).mockResolvedValueOnce(inputDto);
            departmentRepository.saveDepartment = mockSaveDepartment;

        });
        test("Test invalid id", () => {
            when(mockFindOOneDepartmentById).calledWith(id).mockResolvedValueOnce(null);
            departmentRepository.findOneDepartmentById = mockFindOOneDepartmentById;
            expect(departmentService.updateDepartment(id, inputDto)).rejects.toThrow(HttpException);
        });

        test("Test valid id", () => {
            when(mockFindOOneDepartmentById).calledWith(id).mockResolvedValueOnce({ name: "HR" });
            departmentRepository.findOneDepartmentById = mockFindOOneDepartmentById;
            expect(departmentService.updateDepartment(id, inputDto)).resolves.toStrictEqual(inputDto);
        });

    });

    describe("Test for removeDepartment", () => {
        const id = 1;
        const mockSoftRemoveDepartment = jest.fn();
        beforeEach(() => {
            when(mockSoftRemoveDepartment).calledWith(sampleDepartments[0]).mockResolvedValueOnce(sampleDepartments[0]);
            departmentRepository.removeDepartment = mockSoftRemoveDepartment;
        });

        test("Test invalid id", () => {
            const mockFindOOneDepartmentById = jest.fn();
            when(mockFindOOneDepartmentById).calledWith(id).mockResolvedValueOnce(null);
            departmentRepository.findOneDepartmentById = mockFindOOneDepartmentById;
            expect(departmentService.removeDepartment(id)).rejects.toThrow(HttpException);
        });

        test("Test valid id", () => {
            const mockFindOOneDepartmentById = jest.fn();
            when(mockFindOOneDepartmentById).calledWith(id).mockResolvedValueOnce(sampleDepartments[0]);
            departmentRepository.findOneDepartmentById = mockFindOOneDepartmentById;
            expect(departmentService.removeDepartment(id)).resolves.toStrictEqual(sampleDepartments[0]);
        });

    });

});
