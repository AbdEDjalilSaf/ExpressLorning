"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
];
app.get("/", (req, res) => {
    var _a;
    (_a = res.status(201)) === null || _a === void 0 ? void 0 : _a.send({ msg: "Hello, --- World!" });
});
app.get("/api/users", (req, res) => {
    res.send([{ id: 1, username: "well", displayname: "Anson" },
        { id: 2, username: "Anis", displayname: "Pil" },
        { id: 3, username: "Soud", displayname: "Stave" },
    ]);
});
app.get("/api/users/:id", (req, res) => {
    console.log(req.params);
    const password = parseInt(req.params.id);
    console.log("----------------", password);
    // if(isNaN(password))
    //   return res.status(400).send({ msg:"Bad Requist"});
    const findUser = mockUsers.find((user) => user.id === password);
    if (!findUser)
        return res.sendStatus(404);
    return res.send(findUser);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
