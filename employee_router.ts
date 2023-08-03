import express from "express";
import Employee from "./employee";
import dataSource from "./data-source";

export const employeeRouter = express.Router()

employeeRouter.get("/", async (req, res) => {
    const nameFilter = req.query.name as string;
    const emailFilter = req.query.email as string;
    const employeeRepository = dataSource.getRepository(Employee);
    const qb = employeeRepository.createQueryBuilder();

    if (nameFilter) {
        qb.andWhere("name LIKE :name", { name: `${nameFilter}%`});
    }

    if (emailFilter) {
        qb.andWhere("email LIKE :email", { email: `%${emailFilter}%`});
    }

    const employees = await qb.getMany();
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
    await employeeRepository.softRemove(employee);
    res.status(200).end()
});