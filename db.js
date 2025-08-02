"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const db = new pg.Client({
//     user: process.env.PG_USER,  // postgres
//     host: process.env.PG_HOST,  // localhost
//     database: process.env.PG_DATABASE, //name of table in database
//     password: process.env.PG_PASSWORD,  // pssword = toot;
//     port: process.env.PG_PORT,  // 5432
//   });
// db.connect();
// db.on('error', (err) => {
//     console.error('Unexpected error on idle client', err);
//     process.exit(-1);
//   });
// export const query = (text, params) => db.query(text, params);
