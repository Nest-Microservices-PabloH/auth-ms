import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

import { BcryptAdapter } from '../adapter/bcryptjs';
import { LoginUserDto, RegisterUserDto } from '../dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger(AuthService.name);
    private readonly bcryptAdapter = new BcryptAdapter();

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to MongoDB');
    }

    async registerUser(registerUserDto: RegisterUserDto) {

        const { email, password, name } = registerUserDto;
        try {
            const user = await this.user.findUnique({
                where: { email },
            });

            if (user) {
                throw new RpcException({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'User already exists',
                })
            }

            const newUser = await this.user.create({
                data: {
                    email,
                    password: this.bcryptAdapter.hashPassword(password),
                    name,
                }
            })

            const { password: _, updatedAt: __, ...rest } = newUser;

            return {
                user: rest,
                token: 'abc'
            }

        } catch (error) {
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        try {
            const user = await this.user.findUnique({
                where: { email },
            });

            if (!user) {
                throw new RpcException({
                    status: HttpStatus.NOT_FOUND,
                    message: 'User not found',
                })
            }

            const isPasswordValid = this.bcryptAdapter.comparePassword(password, user.password);

            if (!isPasswordValid) {
                throw new RpcException({
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'Invalid credentials'
                })
            }

            const { password: _, updatedAt: __, createdAt: ___, ...rest } = user;

            return {
                user: rest,
                token: 'abc'
            }
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message || 'Unexpected error',
            });
        }
    }

}
