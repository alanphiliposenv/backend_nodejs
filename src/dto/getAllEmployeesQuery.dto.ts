import { IsNumber, IsNumberString, IsOptional } from "class-validator";

class GetAllEmployeesQueryDto {
    @IsNumberString()
    @IsOptional()
    page: number;

    @IsNumberString()
    @IsOptional()
    pageSize: number;
}

export default GetAllEmployeesQueryDto;