import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { LoginUserDto, RegisterUserDto } from '../dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger(AuthService.name);

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to MongoDB');
    }

    registerUser(registerUserDto: RegisterUserDto) {
        return { registerUserDto }
    }

    loginUser(loginUserDto: LoginUserDto) {
        return { loginUserDto }
    }

}
