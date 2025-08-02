"use strict";
// import cors from "cors";
// import { CorsOptions } from "cors";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};
exports.default = corsOptions;
