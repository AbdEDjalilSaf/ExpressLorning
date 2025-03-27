import express, { Request, Response } from 'express';
import users from "./routes/users";
import products from "./routes/products";
import cookieParser from 'cookie-parser';
import session, { SessionData } from "express-session"
import passport from "passport";
import passportConfig from './config/passportConfig';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Usere } from "./config/schemas/user"
import cors from "cors";
import corsOptions from "./config/corsConfig";
import { console } from 'inspector';


// import { it } from 'node:test';

declare module 'express-session' {
  interface SessionData {
    visited?: boolean;
    user?: User;
    cart?: any[];
  }
}

const app = express();
const PORT = 4000;
const SECRET_KEY = 'secure-validation';

// passport configuration
app.use(passport.initialize());
// app.use(passport.session());
app.use(cors(corsOptions));
// app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());  


// mongoose connection 
// mongoose
// .connect("mongodb://0.0.0.0:27017/express")
// .then(() => console.log("Connected to database"))
// .catch((err) => console.log("Error ----- ",err));

// routes
app.use(users);
app.use(products);
// session configuration
app.use(session({
  secret:"secure",
  saveUninitialized: true,
  resave:false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: false,
    secure: false,
    sameSite: "none",
  },
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/express', 
    client: mongoose.connection.getClient()
  })
}));
// cookie parser configuration
app.use(cookieParser("secure"));

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: string[];
    refreshToken: string[];
}



app.get("/",(req: Request, res: Response) => {  
  console.log("req.session --- ",req.session);  
  console.log("req.session.id ++++++++ ",req.session.id) ;
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
  console.log(`Server is running on http://localhost:${PORT}`);
});


// , passportConfig.authenticate('local')
app.post("/api/auth", async (req: Request, res: Response): Promise<void> => {
  const cookies = req.cookies;

  const { email, password } = req.body;

  console.log("req.body ++++++++", req.body);
  console.log("email ++++++++", email);
  console.log("password ---------", password);

  if (!email || !password) {
    res.status(400).json({ 'message': 'Username and password are required.' });
    return;
  }

  const foundUser = await Usere.findOne({ email: email }).exec();
  if (!foundUser) {
    console.log("User not found First");
    res.sendStatus(401); // Unauthorized 
    return;
  }

  if( password === foundUser.password){
    console.log("Right password");
  }else{
    console.log("Right password");
  }

  // Evaluate password 
  // console.log("foundUser.password +++++++++++++++", foundUser.password);
  const match = await bcrypt.compare(password, foundUser.password);
  // console.log("match =========== ", match);
  if (match) {
    const roles = Object.values(foundUser.roles || {}).filter(Boolean);

    // Create JWTs
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.name,
          "roles": roles
        }
      },
      SECRET_KEY,
      { expiresIn: '10s' }
    );

    const newRefreshToken = jwt.sign(
      { "username": foundUser.name },
      SECRET_KEY,
      { expiresIn: '15s' }
    );

    // Handle refresh token array
    let newRefreshTokenArray =
      !cookies?.jwt
        ? foundUser.refreshToken || []
        : (foundUser.refreshToken || []).filter(rt => rt !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await Usere.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        // Clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    }

    // Saving refreshToken with current user
    foundUser.refreshToken = [...(newRefreshTokenArray || []), newRefreshToken];
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });

    // Send authorization roles and access token to user
    res.json({ accessToken });

  } else {
    console.log("User not found Last");
    res.sendStatus(401);
  }

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
console.log("Inside /api/auth");
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
});


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


app.post("/api/auth/logout",(req: Request, res: Response) => {
console.log("Inside /api/auth/logout ============ req.user",req.user);
if(!req.user){
  res.status(401).send({ msg: "Not Authenticated" });
  return;
}
     req.logout((err)=>{
        console.log("Inside logout");
        if(err) res.sendStatus(400);
        res.status(200);
        console.log("Outside logout");
     });
});


app.get("/api/auth/discord",passport.authenticate('discord'),(req, res) => {
  res.redirect('/api/users');
});

app.get("/api/auth/discord/redirect",passport.authenticate('discord'),(req: Request, res: Response) => {
  console.log("Inside /api/auth/discord/redirect");
  console.log(req.user);
  console.log(req.session);
  console.log(req.session.id);
  res.status(200).send(req.user);
});


app.get("/api/auth/status",passportConfig.authenticate('local'),(req: Request, res: Response) => {
// req.sessionStore.get(req.session.id,(err,sessionData)=>{
//   console.log("session data ----- ",sessionData);
// });
//  req.session.user ? 
//  res.status(200).send(req.session.user) : 
//  res.status(401).send({ msg: "Not Authenticated" });
console.log("Inside /api/auth/status");
console.log("req.user",req.user);
console.log("req.session",req.session);
console.log("req.session.id",req.session.id);
req.user ? res.status(200).send(req.user) : res.status(401).send({ msg: "Not Authenticated" });

});


app.post("/api/cart",(req: Request, res: Response) => {
  if(!req.session.user){
    res.status(401).send({ msg: "Not Authenticated" });
    return;
  }
  const { body: item } = req;
  const { cart } = req.session;
  if(cart){
    console.log("cart ---",cart);
    cart.push(item); 
    console.log("item ---",item);
    res.status(201).send(item);
  }else{
    req.session.cart = [item];
  }
});


app.get("/api/cart",(req: Request, res: Response) => {
  if(!req.session.user){
    res.status(401).send({ msg: "Not Authenticated" });
    return;
  }
 res.status(200).send(req.session.cart ? req.session.cart : []);
});


// client_secret : KgV2rwX7uTV2cwZnrbFoO6QYf74wViUf
// client_id : 1335533852529004574
// client_url: http://localhost:4000/api/auth/discord/redirect