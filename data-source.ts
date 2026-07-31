import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

config();

export default new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  synchronize: false,
  ssl:
    process.env.DB_SSL === 'true' || process.env.DB_SSL === '1'
      ? { rejectUnauthorized: false }
      : false,

  entities: [join(__dirname, 'src/**/*.entity.js')],

  migrations: [join(__dirname, 'src/migrations/*.js')],
});
