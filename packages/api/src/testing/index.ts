import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';

export function getConfigImport() {
  return ConfigModule.forRoot({
    load: [configuration],
  });
}

export function getDatabaseImportsForEntities(entities) {
  return [
    getConfigImport(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres' as 'postgres',
        url: configService.get('database.url'),
        entities,
      }),
    }),
    TypeOrmModule.forFeature(entities),
  ];
}
