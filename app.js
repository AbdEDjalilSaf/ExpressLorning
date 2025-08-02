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
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passportConfig_1 = __importDefault(require("./config/passportConfig"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const corsConfig_1 = __importDefault(require("./config/corsConfig"));
const inspector_1 = require("inspector");
const app = (0, express_1.default)();
const PORT = 5000;
const SECRET_KEY = 'secure-validation';
// passport configuration
app.use(passport_1.default.initialize());
// app.use(passport.session());
app.use((0, cors_1.default)(corsConfig_1.default));
// app.use(cors({ origin: "*", credentials: true }));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// mongoose connection 
mongoose_1.default
    .connect("mongodb://0.0.0.0:27017/express")
    .then(() => inspector_1.console.log("Connected to database"))
    .catch((err) => inspector_1.console.log("Error ----- ", err));
// routes
app.use(users_1.default);
app.use(products_1.default);
// session configuration
app.use((0, express_session_1.default)({
    secret: "secure",
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: false,
        secure: false,
        sameSite: "none",
    },
    store: connect_mongo_1.default.create({
        mongoUrl: 'mongodb://localhost:27017/express',
        client: mongoose_1.default.connection.getClient()
    })
}));
// cookie parser configuration
app.use((0, cookie_parser_1.default)("secure"));
app.get("/", (req, res) => {
    inspector_1.console.log("req.session --- ", req.session);
    inspector_1.console.log("req.session.id ++++++++ ", req.session.id);
    // req.sessionStore.get(req.session.id,(err,SessionData)=>{
    //   if(err){
    //     console.log("----- err -----",err);
    //     res.status(500).send({ msg: "Internal Server Error" });
    //     throw err;
    //   }
    //   console.log("session Data ----- ",SessionData);
    // });
    // if (req.session.visited) {
    //   res.status(200).send({ msg: "Welcome back!" });
    // } else {
    //   req.session.visited = true; // Mark as visited
    //   // res.cookie("name", "hello", { maxAge: 1000 * 60 * 60, signed: true });
    //   res.status(201).send({ msg: "Hello, --- World more! First visit!" });
    // }
    res.status(201).send({ msg: "Hello, --- World more! First visit!" });
});
app.listen(PORT, () => {
    inspector_1.console.log(`Server is running on http://localhost:${PORT}`);
});
// , passportConfig.authenticate('local')
app.post("/api/auth", passportConfig_1.default.authenticate('local'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const cookies = req.cookies;
    // const { email, password } = req.body;
    // console.log("req.body ++++++++", req.body);
    // console.log("email ++++++++", email);
    // console.log("password ---------", password);
    // if (!email || !password) {
    //   res.status(400).json({ 'message': 'Username and password are required.' });
    //   return;
    // }
    // const foundUser = await Usere.findOne({ email: email }).exec();
    // if (!foundUser) {
    //   console.log("User not found First");
    //   res.sendStatus(401); // Unauthorized 
    //   return;
    // }
    // if( password === foundUser.password){
    //   console.log("Right password");
    // }else{
    //   console.log("Right password");
    // }
    // // Evaluate password 
    // // console.log("foundUser.password +++++++++++++++", foundUser.password);
    // const match = await bcrypt.compare(password, foundUser.password);
    // // console.log("match =========== ", match);
    // if (match) {
    //   const roles = Object.values(foundUser.roles || {}).filter(Boolean);
    //   // Create JWTs
    //   const accessToken = jwt.sign(
    //     {
    //       "UserInfo": {
    //         "username": foundUser.name,
    //         "roles": roles
    //       }
    //     },
    //     SECRET_KEY,
    //     { expiresIn: '10s' }
    //   );
    //   const newRefreshToken = jwt.sign(
    //     { "username": foundUser.name },
    //     SECRET_KEY,
    //     { expiresIn: '15s' }
    //   );
    //   // Handle refresh token array
    //   let newRefreshTokenArray =
    //     !cookies?.jwt
    //       ? foundUser.refreshToken || []
    //       : (foundUser.refreshToken || []).filter(rt => rt !== cookies.jwt);
    //   if (cookies?.jwt) {
    //     const refreshToken = cookies.jwt;
    //     const foundToken = await Usere.findOne({ refreshToken }).exec();
    //     // Detected refresh token reuse!
    //     if (!foundToken) {
    //       // Clear out ALL previous refresh tokens
    //       newRefreshTokenArray = [];
    //     }
    //     res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    //   }
    //   // Saving refreshToken with current user
    //   foundUser.refreshToken = [...(newRefreshTokenArray || []), newRefreshToken];
    //   const result = await foundUser.save();
    //   // Creates Secure Cookie with refresh token
    //   res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
    //   // Send authorization roles and access token to user
    //   res.json({ accessToken });
    // } else {
    //   console.log("User not found Last");
    //   res.sendStatus(401);
    // }
    // const { 
    //   name 
    // } = req.body;
    // const findUser = mockUsers.find(user => user.name === name);
    // if(!findUser || findUser?.password !== password){ 
    //   res.status(401).send({ msg: "Your password or username is incorrect" });
    // }
    // req.session.user = findUser;
    // console.log("req.session.user ---",req.session.user);
    // res.status(200).send(findUser);
    inspector_1.console.log("Inside /api/auth");
    // const findUser = await Usere.findOne({ name });
    // if (findUser) {
    // req.session.user = {
    //   id: findUser._id.toString(),
    //   name: findUser.name,
    //   password: findUser.password,
    //   email: findUser.email,
    // };
    //   const user = { name: name };
    //   const token = jwt.sign(user, SECRET_KEY, { expiresIn: '20min' });
    //   console.log("token ===", token);
    //   res.json({ token });
    // }
    // res.({ token });
    // res.sendStatus(200);
}));
// app.get("/api/auth/protected",authenticationJWT,(req: Request, res: Response));
// const authenticateJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//       const token = authHeader.split(' ')[1];
//       jwt.verify(token, SECRET_KEY, (err, user) => {
//           if (err) {
//               return res.sendStatus(403);
//           }
//           req.user = user;
//           next();
//       });
//   } else {
//       res.sendStatus(401);
//   }
// };
app.post("/api/auth/logout", (req, res) => {
    inspector_1.console.log("Inside /api/auth/logout ============ req.user", req.user);
    if (!req.user) {
        res.status(401).send({ msg: "Not Authenticated" });
        return;
    }
    req.logout((err) => {
        inspector_1.console.log("Inside logout");
        if (err)
            res.sendStatus(400);
        res.status(200);
        inspector_1.console.log("Outside logout");
    });
});
app.get("/api/auth/discord", passport_1.default.authenticate('discord'), (req, res) => {
    res.redirect('/api/users');
});
app.get("/api/auth/discord/redirect", passport_1.default.authenticate('discord'), (req, res) => {
    inspector_1.console.log("Inside /api/auth/discord/redirect");
    inspector_1.console.log(req.user);
    inspector_1.console.log(req.session);
    inspector_1.console.log(req.session.id);
    res.status(200).send(req.user);
});
app.get("/api/auth/status", passportConfig_1.default.authenticate('local'), (req, res) => {
    // req.sessionStore.get(req.session.id,(err,sessionData)=>{
    //   console.log("session data ----- ",sessionData);
    // });
    //  req.session.user ? 
    //  res.status(200).send(req.session.user) : 
    //  res.status(401).send({ msg: "Not Authenticated" });
    inspector_1.console.log("Inside /api/auth/status");
    inspector_1.console.log("req.user", req.user);
    inspector_1.console.log("req.session", req.session);
    inspector_1.console.log("req.session.id", req.session.id);
    req.user ? res.status(200).send(req.user) : res.status(401).send({ msg: "Not Authenticated" });
});
app.post("/api/cart", (req, res) => {
    if (!req.session.user) {
        res.status(401).send({ msg: "Not Authenticated" });
        return;
    }
    const { body: item } = req;
    const { cart } = req.session;
    if (cart) {
        inspector_1.console.log("cart ---", cart);
        cart.push(item);
        inspector_1.console.log("item ---", item);
        res.status(201).send(item);
    }
    else {
        req.session.cart = [item];
    }
});
app.get("/api/cart", (req, res) => {
    if (!req.session.user) {
        res.status(401).send({ msg: "Not Authenticated" });
        return;
    }
    res.status(200).send(req.session.cart ? req.session.cart : []);
});
// client_secret : KgV2rwX7uTV2cwZnrbFoO6QYf74wViUf
// client_id : 1335533852529004574
// client_url: http://localhost:4000/api/auth/discord/redirect
