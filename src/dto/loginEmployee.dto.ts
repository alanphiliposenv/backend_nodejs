import { IsNotEmpty, IsString } from "class-validator";

class LoginEmployeeDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export default LoginEmployeeDto;
