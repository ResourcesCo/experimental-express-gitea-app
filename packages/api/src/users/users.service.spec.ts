import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Token } from './tokens/token.entity';
import { Repository, getRepository, getConnectionManager } from 'typeorm';
import { getDatabaseImportsForEntities } from '../testing';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let authService: AuthService;
  let module: TestingModule;
  let repository: Repository<User>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...getDatabaseImportsForEntities([User, Token])],
      providers: [AuthService, UsersService],
    }).compile();

    usersService = await module.get<UsersService>(UsersService);
    authService = await module.get<AuthService>(AuthService);
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
        isActive: true,
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
        isActive: true,
      });
      expect(userData.id).toHaveLength(21);

      const loginData = await usersService.login({
        email: 'test@example.com',
        password: 'testPassword',
      });
      expect(loginData.user.email).toEqual('test@example.com');
      expect(authService.readToken(loginData.accessToken).type).toEqual(
        'access',
      );
      expect(authService.readToken(loginData.refreshToken).type).toEqual(
        'refresh',
      );
    });

    it('should fail on invalid password', async () => {
      const userData = await usersService.create({
        email: 'test@example.com',
        password: 'testPassword',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
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

    it('should fail on inactive user', async () => {
      const userData = await usersService.create({
        email: 'test@example.com',
        password: 'testPassword',
        firstName: 'Test',
        lastName: 'User',
        isActive: false,
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

  describe('signup', () => {
    it('should sign up a user', async () => {
      const userData = await usersService.signUp({
        signupCode: 'openSESAME',
        email: 'test@example.com',
        password: 'testPassword',
        firstName: 'Test',
        lastName: 'User',
      });
      expect(userData.accessToken).toBeTruthy();
    });

    it('should fail to sign up with an invalid auth code', async () => {
      let err;
      try {
        const userData = await usersService.signUp({
          signupCode: 'kittens',
          email: 'test@example.com',
          password: 'testPassword',
          firstName: 'Test',
          lastName: 'User',
        });
      } catch (e) {
        err = e;
      }
      expect(err).toBeInstanceOf(UnauthorizedException);
    });
  });
});
