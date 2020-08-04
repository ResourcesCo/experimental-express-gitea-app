export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'postgres',
    url: process.env.NODE_ENV = 'test'
      ? process.env.DB_URL || 'postgres://localhost:5432/resources_co_api'
      : process.env.TEST_DB_URL ||
        'postgres://localhost:5432/resources_co_api_test',
  },
});
