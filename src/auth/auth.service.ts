import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

import { BcryptAdapter } from '../adapter/bcryptjs';
import { LoginUserDto, RegisterUserDto } from '../dto';
import { envs } from '../config';

import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger(AuthService.name);
    private readonly bcryptAdapter = new BcryptAdapter();

    constructor(private readonly jwtService: JwtService) {
        super();
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to MongoDB');
    }

    async signJWT(payload: JwtPayload) {
        return this.jwtService.sign(payload)
    }

    async verifyToken(token: string) {
        try {
            const { sub, iat, exp, ...user } = await this.jwtService.verify(token, {
                secret: envs.JWT_SECRET
            });
            return {
                user,
                token: await this.signJWT(user)
            };
        } catch (error) {
            console.log(error)
            throw new RpcException({
                status: HttpStatus.UNAUTHORIZED,
                message: 'Invalid token',
            })
        }
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

            const { password: _, updatedAt: __, createdAt: ___, ...rest } = newUser;

            return {
                user: rest,
                token: await this.signJWT(rest)
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
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'Invalid credentials',
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
                token: await this.signJWT(rest)
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
