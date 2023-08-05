import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import AddressDto from "./address.dto";
import { Type } from "class-transformer";
import { Role } from "../util/role.enum";

class EmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @ValidateNested({each: true})
    @Type(() => AddressDto)
    address: Address;

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

    @IsNotEmpty()
    @IsNumber()
    departmentId: number;
}

export default EmployeeDto;
