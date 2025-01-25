// import core modules
import dotenv from 'dotenv';
import path from 'path';
import { cwd } from 'process';

dotenv.config({
  path: path.join(cwd(), '.env'),
});

const config = {
  port: process.env.PORT,
  db_uri: process.env.DB_URI,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expiration_time: process.env.JWT_EXPIRATION_TIME,
};

export default config;
