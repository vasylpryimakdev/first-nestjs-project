export const testConfig = {
  database: {
    type: 'postgres',
    host: 'localhost',
    port: parseInt(process.env.TEST_DB_PORT ?? '5432', 10),
    username: 'postgres',
    password: 'postgres',
    database: 'tasks_e2e',
    synchronize: true,
  },
  app: {
    messagePrefix: '',
  },
  auth: {
    jwt: {
      secret: 'secret-123',
      expiresIn: '1m',
    },
  },
};
