import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { TokensService } from './tokens.service';
import { User } from '../user.entity';
import { Token } from './token.entity';
import { Repository, getRepository, getConnectionManager } from 'typeorm';
import { getDatabaseImportsForEntities } from '../../testing';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';

describe('TokensService', () => {
  let tokensService: TokensService;
  let module: TestingModule;
  let usersRepository: Repository<User>;
  let tokensRepository: Repository<Token>;
  let user: User;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...getDatabaseImportsForEntities([User, Token])],
      providers: [TokensService],
    }).compile();

    tokensService = await module.get<TokensService>(TokensService);
    usersRepository = getRepository(User);
    tokensRepository = getRepository(Token);

    user = new User();
    user.email = 'test@example.com';
    user.passwordDigest = '';
    user.firstName = 'Test';
    user.lastName = 'User';
    user.isActive = true;
    await usersRepository.save(user);
  });

  afterEach(async () => {
    await tokensRepository
      .createQueryBuilder()
      .delete()
      .execute();
  });

  afterAll(async () => {
    await usersRepository
      .createQueryBuilder()
      .delete()
      .execute();
    await module.close();
  });

  describe('create', () => {
    it('should create a token', async () => {
      const { token } = await tokensService.createToken({
        type: 'password-reset/begin',
        user,
      });
      expect(token.length).toBeGreaterThan(30);
    });
  });

  describe('verify', () => {
    it('should verify and return a token', async () => {});

    it('should fail to verify an expired token', async () => {});
  });
});
