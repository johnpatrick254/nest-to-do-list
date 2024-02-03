import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDTO } from './DTO/createuser.dto';
import { User } from '@prisma/client';
import { GetUsersDTO } from './DTO/getusers.dto';
import { UpdateUserDTO } from './DTO/updateuser.dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    async createUser(data: CreateUserDTO): Promise<Pick<User, "email" | "last_name" | "first_name" | "id">> {

        try {
            const newUser = await this.prisma.user.create({
                data
            });
            const { password, ...userData } = newUser;

            return userData;
        } catch (error) {
            console.error(error)
            if (error.code == "P2002") {
                throw new ConflictException("user already exists");
            }
            throw new InternalServerErrorException()
        }

    };

    async getUsers(data: GetUsersDTO) {
        try {
            const pageNumber = +data.pageNumber;
            const take = +data.take;
            const totals = await this.prisma.user.count();
            const lastPage = Math.ceil(totals / take)
            const skip = (pageNumber - 1) * take;

            const users = await this.prisma.user.findMany({
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true
                },
                skip,
                take
            });
            return {
                ...users,
                meta: {
                    currentPage: pageNumber,
                    lastPage
                }
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException()
        }
    };

    async getUserById(id: string): Promise<Pick<User, "email" | "last_name" | "first_name" | "id">> {
        try {
            const foundUser = await this.prisma.user.findUnique({
                where: {
                    id
                }
            });

            if (!foundUser) throw new NotFoundException("User not found")
            const { password, ...user } = foundUser;
            return user;
        } catch (error) {
            console.error(error);
            if (error.status === 404) throw new NotFoundException("User not found");
            throw new InternalServerErrorException();
        }
    };

    async updateUser(data: UpdateUserDTO, id: string): Promise<Pick<User, "email" | "last_name" | "first_name" | "id">> {
        try {
            const { password, ...user } = await this.prisma.user.update({
                data,
                where: {
                    id
                }
            })

            return user;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException();
        }

    };

    async deleteUser(id: string): Promise<void> {
        const deletedUser = await this.prisma.user.delete({
            where: {
                id
            }
        });

        if (!deletedUser) throw new NotFoundException('user does not exist')
    }

}
