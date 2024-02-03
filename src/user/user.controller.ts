import { Controller, Post, Body, Get, Query, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTO/createuser.dto';
import { User } from '@prisma/client';
import { GetUsersDTO } from './DTO/getusers.dto';
import { UpdateUserDTO } from './DTO/updateuser.dto';

@Controller('user')
export class UserController {
    constructor(private service: UserService) { }

    @Post()
    async createUser(@Body() data: CreateUserDTO): Promise<Pick<User, "email" | "first_name" | "last_name" | "id">> {
        return await this.service.createUser(data);
    };

    @Get()
    async getUsers(@Query() data: GetUsersDTO) {
        return await this.service.getUsers(data);
    };

    @Get('/:id')
    async getUserById(@Param('id') id: string): Promise<Pick<User, "email" | "last_name" | "first_name" | "id">> {
        return await this.service.getUserById(id);
    };

    @Put('/:id')
    async updateUser(@Param('id') id: string, @Body() data: UpdateUserDTO): Promise<Pick<User, "email" | "last_name" | "first_name" | "id">> {
        return await this.service.updateUser(data, id);
    };

    @Delete('/:id')
    async deleteUser(@Param('id') id: string):Promise<void> {
        return await this.service.deleteUser(id);
    }

}
