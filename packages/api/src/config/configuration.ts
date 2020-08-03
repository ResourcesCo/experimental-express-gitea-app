export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: 'postgres://localhost:5432/resources_co_api',
  },
});
