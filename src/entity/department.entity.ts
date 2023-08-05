import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Employee from "./employee.entity";
import AbstractEntity from "./abstract.entity";

@Entity("departments")
class Department extends AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @OneToMany(() => Employee, (employee) => employee.department)
    employees: Employee[]
}

export default Department;
