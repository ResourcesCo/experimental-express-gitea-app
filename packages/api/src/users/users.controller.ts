import { Controller, Get, Req, Res, HttpStatus } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [];
  }
}
