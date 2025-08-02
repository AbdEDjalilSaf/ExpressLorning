"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import cookieParser from 'cookie-parser';
const router = (0, express_1.Router)();
router.get("/api/products", (req, res) => {
    var _a;
    // Log cookies for debugging
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.cookie("name", "hello", { maxAge: 1000 * 60 * 60 });
    // Check if the cookie exists and has the correct value
    if (((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.name) === "hello") {
        // Send the products if the cookie is valid
        res.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
    }
    else {
        // Send a 403 error if the cookie is missing or incorrect
        res.status(403).send({ msg: "Sorry. You need the correct cookie." });
    }
});
exports.default = router;
