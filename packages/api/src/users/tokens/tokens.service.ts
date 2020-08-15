import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
  ) {}
}
