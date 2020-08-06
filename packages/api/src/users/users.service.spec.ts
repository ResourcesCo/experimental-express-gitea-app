import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getDatabaseImportsForEntities } from '../testing';

describe('UsersService', () => {
  let usersService: UsersService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...getDatabaseImportsForEntities([User])],
      providers: [UsersService],
    }).compile();

    usersService = await module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await usersService.findAll()).toEqual([]);
    });
  });
});
