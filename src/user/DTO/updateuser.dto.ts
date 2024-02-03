import { IsOptional, IsString } from "class-validator";


export class UpdateUserDTO{
    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    first_name: string;

    @IsOptional()
    @IsString()
    last_name: string;
}