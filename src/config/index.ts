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
};

export default config;
