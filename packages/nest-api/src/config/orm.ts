import configuration from './configuration';

const ormConfig = configuration().database;

export = {
  type: 'postgres',
  ...ormConfig,
};
