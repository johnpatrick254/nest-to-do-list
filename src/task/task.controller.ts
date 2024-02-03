import { Controller, Post, Body, Get, Query, Put, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { Todo } from '@prisma/client';
import { GetTasksDTO } from './DTO/get-tasks.dto';
import { UpdateTaskDTO } from './DTO/update-task.dto';

@Controller('task')
export class TaskController {
    constructor(private service: TaskService) { }
    @Post()
    async createTask(@Body() data: CreateTaskDTO): Promise<Todo> {
        return await this.service.createTask(data)
    };

    @Get()
    async getTasks(@Query() data: GetTasksDTO) {
        return await this.service.getTasks(data);
    };

    @Get('/:id')
    async getTasksById(@Param('id') id: string) {
        return await this.service.getTaskById(id);
    };

    @Put('/:id')
    async updateTask(@Body() data: UpdateTaskDTO, @Param('id') id: string): Promise<Todo> {
        return await this.service.updateTask(data, id);
    };

    @Delete('/:id')
    async deleteTask(@Param('id') id: string): Promise<void> {
        return await this.service.deleteTask(id);
    };

}
