"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/*Db credentials shouldn't be hardcoded in the code. It's a good practice to store it in env files and add the .env file to gitignore
so that you don't push the credentials to github*/
exports.pool = new pg_1.Pool({
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    port: 5432,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    ssl: true
});
