import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Token } from './tokens/token.entity';
import { getDatabaseImportsForEntities } from '../testing';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...getDatabaseImportsForEntities([User, Token])],
      controllers: [UsersController],
      providers: [AuthService, UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('signup', () => {
    it('should call signup', async () => {
      const spy = jest.spyOn(usersService, 'signUp');

      try {
        await usersController.signUp({
          signupCode: 'kittens',
          email: 'test@example.com',
          password: 'testPassword',
          firstName: 'Test',
          lastName: 'User',
        });
      } catch {}
      expect(spy).toHaveBeenCalled();
    });
  });
});
