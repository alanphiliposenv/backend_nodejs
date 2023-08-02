import express from "express";
import Employee from "./employee";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import dataSource from "./data-source";

let count = 2;
const employees: Employee[] = [
    {
        id: 1,
        name: "Emp1",
        email: "Emp1@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        name: "Emp2",
        email: "Emp2@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date()
    }
]


export const employeeRouter = express.Router()

employeeRouter.get("/", async (req, res) => {
    const employeeRepository = dataSource.getRepository(Employee);
    const employees = await employeeRepository.find();
    res.status(200).send(employees);
});

employeeRouter.get("/:id", async (req, res) => {
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id: Number(req.params.id) })
    res.status(200).send(employee);
});

employeeRouter.post("/", async (req, res) => {
    const employeeRepository = dataSource.getRepository(Employee);
    const newEmployee = new Employee();
    newEmployee.email = req.body.email;
    newEmployee.name = req.body.name;
    const savedEmployee = await employeeRepository.save(newEmployee);
    res.status(201).send(savedEmployee);
});

employeeRouter.put("/:id", async (req, res) => {
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id: Number(req.params.id) });
    employee.email = req.body.email;
    employee.name = req.body.name;
    const savedEmployee = await employeeRepository.save(employee);
    res.status(200).send(savedEmployee)
});

employeeRouter.delete("/:id", async (req, res) => {
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id: Number(req.params.id) });
    await employeeRepository.remove(employee);
    res.status(200).end()
});