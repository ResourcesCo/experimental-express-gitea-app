import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
// import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  // let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      // providers: [UsersService],
    }).compile();

    // usersService = moduleRef.get<UsersService>(CatsService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // jest.spyOn(usersService, 'findAll').mockImplementation(() => result);

      expect(await usersController.findAll()).toEqual([]);
    });
  });
});
