import { IsNotEmpty, IsString } from "class-validator";


export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string

    @IsNotEmpty()
    @IsString()
    password: string
}