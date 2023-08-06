import { IsOptional, IsString } from "class-validator";

class UpdateAddressDto {
    @IsString()
    @IsOptional()
    address_line_1: string;

    @IsString()
    @IsOptional()
    address_line_2: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    state: string;

    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    pincode: string;
}

export default UpdateAddressDto;
