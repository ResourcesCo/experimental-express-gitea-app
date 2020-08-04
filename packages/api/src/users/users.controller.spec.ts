import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
import { createMock } from '@golevelup/ts-jest';
import { Response } from 'express';

const mockResponseObject = () => {
  return createMock<Response>({
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  });
};

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
      const response = mockResponseObject();
      // jest.spyOn(usersService, 'findAll').mockImplementation(() => result);

      await usersController.findAll(response);
      expect(response.json).toHaveBeenCalledWith([]);
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });
});
