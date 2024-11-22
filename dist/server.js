"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import app module
const app_1 = __importDefault(require("./app"));
// import config module
const config_1 = __importDefault(require("./config"));
const PORT = config_1.default.port || 5000;
const DB_URI = config_1.default.db_uri;
// import core modules
const mongoose_1 = __importDefault(require("mongoose"));
// MAIN FUNCTION TO CONNECT MONGOOSE AND START SERVER
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(DB_URI);
        console.log('Database connected successfully');
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Database connection failed:', error);
    }
});
main();
