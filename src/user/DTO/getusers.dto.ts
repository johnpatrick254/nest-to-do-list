import { IsNotEmpty } from "class-validator"
export class GetUsersDTO {
    @IsNotEmpty()
    take: string;

    @IsNotEmpty()
    pageNumber: string
}