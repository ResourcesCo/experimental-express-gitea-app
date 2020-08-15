import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  SignupDto,
  SignupResponseDto,
  LoginUserDto,
  LoginResponseDto,
} from './dto';

@Controller('users')
export class UsersController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Post('sign-up')
  async signUp(@Body() dto: SignupDto): Promise<SignupResponseDto> {
    return this.usersService.signUp(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = dto;
    return this.usersService.login({ email, password });
  }
}
