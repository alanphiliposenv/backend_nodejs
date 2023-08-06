import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import Address from "./address.entity";
import AbstractEntity from "./abstract.entity";
import { Role } from "../util/role.enum";
import Department from "./department.entity";

@Entity("employees")
class Employee extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    username: string;

    @OneToOne(() => Address, (address) => address.employee, { cascade: true })
    address: Address;

    @Column()
    joiningDate: string;

    @Column()
    experience: number;

    @Column()
    password: string;

    @Column({ default: Role.USER })
    role: Role;

    @Column({ nullable: true })
    departmentId: number;

    @ManyToOne(() => Department, { nullable: true })
    department: Department;
}

export default Employee;
