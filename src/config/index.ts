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
  node_env: process.env.NODE_ENV,
  sp_endpoint: process.env.SP_ENDPOINT,
  sp_username: process.env.SP_USERNAME,
  sp_password: process.env.SP_PASSWORD,
  sp_prefix: process.env.SP_PREFIX,
  sp_return_url: process.env.SP_RETURN_URL,
  sp_db_file: process.env.SP_DB_FILE,
};

export default config;
