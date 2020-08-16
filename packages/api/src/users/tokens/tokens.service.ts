import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { User } from '../user.entity';

type TokenType =
  | 'verify-email'
  | 'password-reset/begin'
  | 'password-reset/submit';

const expiresIn = {
  'verify-email': 2 * 24 * 60 * 60 * 1000,
  'password-reset/begin': 10 * 60 * 1000,
  'password-reset/submit': 5 * 60 * 1000,
};

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
  ) {}

  async createToken({
    type,
    user,
  }: {
    type: TokenType;
    user: User;
  }): Promise<{ token: string }> {
    const token = new Token();
    token.user = user;
    token.type = type;
    token.expiresAt = new Date(Date.now() + expiresIn[type]);
    token.isActive = true;
    await this.tokensRepository.save(token);
    return {
      token: token.token,
    };
  }
}
