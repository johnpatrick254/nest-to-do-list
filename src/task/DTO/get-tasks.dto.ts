import { TaskStatus } from "@prisma/client";
import { IsNotEmpty, IsEnum, IsOptional } from "class-validator"
export class GetTasksDTO {
    @IsNotEmpty()
    pageNumber: string;

    @IsNotEmpty()
    take: string;

    @IsNotEmpty()
    userId: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus;
}