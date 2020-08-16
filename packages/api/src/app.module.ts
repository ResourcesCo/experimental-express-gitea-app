import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { User } from './users/user.entity';
import { Token } from './users/tokens/token.entity';
import { UsersModule } from './users/users.module';
import { Connection } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      ...(['development', 'test'].includes(process.env.NODE_ENV)
        ? {
            envFilePath: [
              `.env.${process.env.NODE_ENV}.local`,
              `.env.${process.env.NODE_ENV}`,
            ],
          }
        : { ignoreEnvFile: true }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres' as 'postgres',
        url: configService.get('database.url'),
        entities: [User, Token],
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
