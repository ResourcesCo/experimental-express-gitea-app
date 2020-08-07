import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Repository, getRepository, getConnectionManager } from 'typeorm';
import { getDatabaseImportsForEntities } from '../testing';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let module: TestingModule;
  let repository: Repository<User>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...getDatabaseImportsForEntities([User])],
      providers: [UsersService],
    }).compile();

    usersService = await module.get<UsersService>(UsersService);
    repository = getRepository(User);
  });

  afterEach(async () => {
    await repository
      .createQueryBuilder()
      .delete()
      .execute();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userData = await usersService.create({
        email: 'test@example.com',
        password: 'testPassword',
        firstName: 'Test',
        lastName: 'User',
      });

      // expect random id to have been created
      expect(userData.id).toHaveLength(21);
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const userData = await usersService.create({
        email: 'test@example.com',
        password: 'testPassword',
        firstName: 'Test',
        lastName: 'User',
      });
      expect(userData.id).toHaveLength(21);

      const loginData = await usersService.login({
        email: 'test@example.com',
        password: 'testPassword',
      });
      expect(loginData.email).toEqual('test@example.com');
    });

    it('should fail on invalid password', async () => {
      const userData = await usersService.create({
        email: 'test@example.com',
        password: 'testPassword',
        firstName: 'Test',
        lastName: 'User',
      });
      expect(userData.id).toHaveLength(21);

      let err;
      try {
        const loginData = await usersService.login({
          email: 'test@example.com',
          password: 'invalidPassword',
        });
      } catch (e) {
        err = e;
      }
      expect(err).toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await usersService.findAll()).toEqual([]);
    });
  });
});
