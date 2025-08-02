"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validationSchemas_1 = require("../utils/validationSchemas");
// import {  } from "../middlewares/middlewares";
// import { mockUsers } from "../utils/containes";
const user_1 = require("../config/schemas/user");
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const users_1 = require("../handler/users");
// interface User {
//     id: number;
//     name: string;
//     email: string;
//     password: string;
// }
const router = (0, express_1.Router)();
router.use((0, express_session_1.default)({
    secret: "secure",
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: false,
        secure: false,
    },
    store: connect_mongo_1.default.create({
        mongoUrl: 'mongodb://localhost:27017/express',
        client: mongoose_1.default.connection.getClient()
    })
}));
router.get('/api/users', (0, express_validator_1.checkSchema)(validationSchemas_1.validationSchemas), (req, res) => {
    var _a;
    console.log("req.session.id ======= ", (_a = req.session) === null || _a === void 0 ? void 0 : _a.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
            console.log("Error getting session data", err);
            throw err;
        }
        console.log("Inside session store Get");
        console.log("sessionData", sessionData);
    });
    const filter = req.query.filter;
    const value = req.query.value;
    if (!filter || !value) {
        res.json(user_1.Usere);
        return;
    }
    const result = (0, express_validator_1.validationResult)(req);
    console.log(result);
    if (filter && value) {
        const filteredUsers = user_1.Usere.find((user) => user[filter] === value);
        res.json(filteredUsers);
        return;
    }
    res.sendStatus(200);
});
router.get("/api/users/:id", users_1.usersId);
router.post("/api/users", (0, express_validator_1.checkSchema)(validationSchemas_1.validationSchemas), users_1.postApiUser);
router.put("/api/users/:id", users_1.putApiUserId);
router.patch("/api/users/:id", users_1.patchApiUserId);
router.delete("/api/users/:id", users_1.deleteApiUserId);
exports.default = router;
