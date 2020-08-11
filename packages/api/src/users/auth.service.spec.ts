import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { getConfigImport } from '../testing';
import { nanoid } from 'nanoid';

describe('AuthService', () => {
  let authService: AuthService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [getConfigImport()],
      providers: [ConfigService, AuthService],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('creating and verifying access token', () => {
    it('should create a token', async () => {
      const userId = nanoid();
      const userAuthId = nanoid();
      const token = await authService.createToken({
        userId,
        userAuthId,
        type: 'access',
      });

      // expect random id to have been created
      expect(token.split('.').length).toEqual(3);
    });

    function createToken() {
      const userId = nanoid();
      const userAuthId = nanoid();
      const token = authService.createToken({
        userId,
        userAuthId,
        type: 'access',
      });
      return { userId, userAuthId, token };
    }

    it('should create and read token', () => {
      const { userId, userAuthId, token } = createToken();
      const result = authService.readToken(token);
      expect(result).toBeTruthy();
      expect(result.userId).toEqual(userId);
      expect(result.userAuthId).toEqual(userAuthId);
      const difference = Math.abs(Date.now() - result.issuedAt.valueOf());
      expect(difference).toBeLessThan(1000);
    });
  });
});
