import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { Todo } from '@prisma/client';
import { GetTasksDTO } from './DTO/get-tasks.dto';
import { UpdateTaskDTO } from './DTO/update-task.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }

    async createTask(data: CreateTaskDTO): Promise<Todo> {
        try {
            return await this.prisma.todo.create({ data })
        } catch (error) {
            console.error(error)
            if (error.code == "P2002") throw new ConflictException('todo already exist')
            throw new InternalServerErrorException()
        }
    };

    async getTasks(data: GetTasksDTO) {
        try {
            const take = +data.take
            const pageNumber = +data.pageNumber
            const skip = (pageNumber - 1) * take;
            const totals = await this.prisma.todo.count({
                where: {
                    userId: data.userId
                }
            });
            const lastPage = Math.ceil(totals / take);
            let config
            if (data.status) {
                config = {
                    userId: data.userId,
                    status: data.status
                }
            } else {
                config = {
                    userId: data.userId,
                }
            }

            const tasks = await this.prisma.todo.findMany(
                {
                    where: config,
                    take,
                    skip
                }
            );

            return {
                ...tasks,
                meta: {
                    currentPage: pageNumber,
                    lastPage
                }
            }

        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException()
        }
    };
    async getTaskById(id: string): Promise<Todo> {

        try {
            const task = await this.prisma.todo.findUnique({ where: { id } })
            if (!task) throw new Error('Task not found')
            return task
        } catch (error) {
            console.error(error)
            if (error.message == 'Task not found') throw new NotFoundException(error.message)
            throw new InternalServerErrorException();
        };

    };

    async updateTask(data: UpdateTaskDTO, id: string): Promise<Todo> {
        try {
            const updatedTask = await this.prisma.todo.update({
                data,
                where: {
                    id 
                }
            })
            return updatedTask
        } catch (error) {
            console.error(error)
            if (error.code == "P2025") throw new NotFoundException('Task not found');
            throw new InternalServerErrorException()
        }
    };

    async deleteTask(id: string): Promise<void> {
        try {
            await this.prisma.todo.delete({ where: { id } })
        } catch (error) {
            console.error(error)
            if (error.code == "P2025") throw new NotFoundException('Task not found');
            throw new InternalServerErrorException()
        }

    };
}
