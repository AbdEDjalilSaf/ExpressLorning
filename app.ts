import express, { Request, Response } from 'express';
import users from "./routes/users";
import products from "./routes/products";
import cookieParser from 'cookie-parser';
import session, { SessionData } from "express-session"
import passport from "passport";
import passportConfig from './config/passportConfig';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
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

// passport configuration
app.use(passport.initialize());
// app.use(passport.session());

app.use(express.json());

// mongoose connection
mongoose
.connect("mongodb://localhost:27017/express")
.then(() => console.log("Connected to database"))
.catch((err) => console.log("Error ----- ",err));

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
  },
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/express', 
    client: mongoose.connection.getClient()
  })
}));
// cookie parser configuration
app.use(cookieParser("secure"));

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
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


app.post("/api/auth",passportConfig.authenticate('local'),(req: Request, res: Response) => {
// const { 
//   body: { name , password }
//  } = req;
// const findUser = mockUsers.find(user => user.name === name);
// if(!findUser || findUser?.password !== password){ 
//   res.status(401).send({ msg: "Your password or username is incorrect" });
// }
// req.session.user = findUser;
// console.log("req.session.user ---",req.session.user);
// res.status(200).send(findUser);
console.log("Inside /api/auth");
res.sendStatus(200);
});


app.post("/api/auth/logout",(req: Request, res: Response) => {

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
console.log(req.user);
console.log(req.session);
console.log(req.session.id);
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