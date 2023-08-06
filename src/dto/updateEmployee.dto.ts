import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import { Role } from "../util/role.enum";
import UpdateAddressDto from "./updateAddress.dto";

class UpdateEmployeeDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    password: string;

    @ValidateNested()
    @Type(() => UpdateAddressDto)
    @IsOptional()
    address: Address;

    @IsEnum(Role)
    @IsOptional()
    role: Role;

    @IsString()
    @IsOptional()
    joiningDate: string;

    @IsNumber()
    @IsOptional()
    experience: number;

    @IsNumber()
    @IsOptional()
    departmentId: number;
}

export default UpdateEmployeeDto;
