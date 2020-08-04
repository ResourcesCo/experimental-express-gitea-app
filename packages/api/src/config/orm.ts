import configuration from './configuration';

const ormConfig = configuration().database;

console.log({ ormConfig });

export = ormConfig;
