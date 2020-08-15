import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TokensModule],
  providers: [ConfigService, UsersService, AuthService],
  controllers: [UsersController],
})
export class UsersModule {}
