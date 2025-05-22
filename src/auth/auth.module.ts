import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { envs } from '../config/envs';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
})
export class AuthModule { }
