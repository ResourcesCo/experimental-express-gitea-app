import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { LoginUserDto } from './dto';

@Controller('users')
export class UsersController {
  @Post()
  async login(@Body() dto: LoginUserDto) {}

  @Get()
  findAll() {
    return [];
  }
}
