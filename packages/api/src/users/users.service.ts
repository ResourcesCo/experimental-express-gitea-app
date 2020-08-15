import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, LoginResponseDto } from './dto';
import { UserData } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserData> {
    const { id, email, password, firstName, lastName, isActive } = dto;
    const user = new User();
    user.id = id;
    user.email = email;
    user.passwordDigest = await argon2.hash(password);
    user.firstName = firstName;
    user.lastName = lastName;
    user.isActive = isActive;
    await this.usersRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    };
  }

  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findOne({
      email: dto.email,
      isActive: true,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const verified = await argon2.verify(user.passwordDigest, dto.password);
    if (verified === true) {
      const { id, email, firstName, lastName, userAuthId, isActive } = user;
      const accessToken = this.authService.createToken({
        userId: id,
        userAuthId,
        type: 'access',
      });
      const refreshToken = this.authService.createToken({
        userId: id,
        userAuthId,
        type: 'refresh',
      });
      return {
        user: {
          id,
          email,
          firstName,
          lastName,
          isActive,
        },
        accessToken,
        refreshToken,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
