import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import AddressDto from "./address.dto";
import { Type } from "class-transformer";

class EmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @ValidateNested({each: true})
    @Type(() => AddressDto)
    address: Address;
}

export default EmployeeDto;
