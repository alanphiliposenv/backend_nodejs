import express from "express";
import Employee from "./employee";

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

employeeRouter.get("/", (req, res) => {
    res.status(200).send(employees)
});

employeeRouter.get("/:id", (req, res) => {
    const employee = employees.find((emp) => emp.id === Number(req.params.id))
    if (employee) {
        res.status(200).send(employee)
    } else {
        res.status(404).end("")
    }
});

employeeRouter.post("/", (req, res) => {
    const newEmployee = new Employee();
    newEmployee.id = ++count;
    newEmployee.email = req.body.email;
    newEmployee.name = req.body.name;
    newEmployee.createdAt = new Date();
    newEmployee.updatedAt = new Date();
    employees.push(newEmployee);
    res.status(201).send(newEmployee)
});

employeeRouter.put("/:id", (req, res) => {
    const employee = employees.find((emp) => emp.id === Number(req.params.id));
    if (!employee) {
        res.status(404).end("")
    } else {
        employee.email = req.body.email;
        employee.name = req.body.name;
        employee.updatedAt = new Date();
        res.status(200).send(employee)
    }
});

employeeRouter.delete("/:id", (req, res) => {
    const idx = employees.findIndex((emp) => emp.id !== Number(req.params.id));
    if (idx < 1) {
        res.status(404).end("");
    } else {
        employees.splice(idx - 1, 1);
        res.status(200).end("");
    }
});