"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import core modules
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
dotenv_1.default.config({
    path: path_1.default.join((0, process_1.cwd)(), '.env'),
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
    allowed_origin: process.env.ALLOWED_ORIGIN
};
exports.default = config;
