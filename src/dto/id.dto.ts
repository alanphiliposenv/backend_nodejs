import { IsNotEmpty, IsNumberString } from "class-validator";

class IdDto {
    @IsNotEmpty()
    @IsNumberString()
    id: number;
}

export default IdDto;
