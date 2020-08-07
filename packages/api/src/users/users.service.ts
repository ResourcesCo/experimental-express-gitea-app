import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { UserData } from './user.interface';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserData> {
    const { id, email, password, firstName, lastName } = dto;
    const user = new User();
    user.id = id;
    user.email = email;
    user.passwordDigest = await argon2.hash(password);
    user.firstName = firstName;
    user.lastName = lastName;
    await this.usersRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async login(dto: LoginUserDto): Promise<UserData> {
    const user = await this.usersRepository.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException();
    }
    const verified = await argon2.verify(user.passwordDigest, dto.password);
    if (verified === true) {
      const { id, email, firstName, lastName } = user;
      return {
        id,
        email,
        firstName,
        lastName,
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
