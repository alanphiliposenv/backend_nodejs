import { IsNumber, IsOptional } from "class-validator";

class GetAllEmployeesQueryDto {
    @IsNumber()
    @IsOptional()
    page: number;
}

export default GetAllEmployeesQueryDto;