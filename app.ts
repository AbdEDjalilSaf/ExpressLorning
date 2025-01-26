import express, { Request, Response } from 'express';
import users from "./routes/users";
import products from "./routes/products";
import cookieParser from 'cookie-parser';
import session, { SessionData } from "express-session"
import passport from "passport";
import passportConfig from './config/passportConfig';
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
// routes
app.use(users);
app.use(products);
// session configuration
app.use(session({
  secret:"secure",
  saveUninitialized: true,
  resave:false,
  cookie: { 
    maxAge: 60000 * 60,
    secure: true, 
  },
}));
// cookie parser configuration
app.use(cookieParser("secure"));

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

const mockUsers: User[] = [ 
    { id: 1, name: 'John Doe', email: 'john@examp le.com', password:"fjsdsjjhwhe" },
    { id: 2, name: 'Mike Rose', email: 'mike01@ex ample.com',password: "nbsjfdbsjjhwke" },
];  

app.get("/",(req: Request, res: Response) => {  
  console.log("req.session---",req.session);  
  console.log("req.session.id---",req.session.id) ;
  req.sessionStore.get(req.session.id,(err,SessionData)=>{
    if(err){
      console.log("----- err -----",err);
      res.status(500).send({ msg: "Internal Server Error" });
      throw err;
    }
    console.log("session Data ----- ",SessionData);
  });
  if (req.session.visited) {
    res.status(200).send({ msg: "Welcome back!" });
  } else {
    req.session.visited = true; // Mark as visited
    // res.cookie("name", "hello", { maxAge: 1000 * 60 * 60, signed: true });
    res.status(201).send({ msg: "Hello, --- World more! First visit!" });
  }
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
res.sendStatus(200);
});


app.get("/api/auth/status",(req: Request, res: Response) => {
req.sessionStore.get(req.session.id,(err,sessionData)=>{
  console.log("session data ----- ",sessionData);
});
 req.session.user ? 
 res.status(200).send(req.session.user) : 
 res.status(401).send({ msg: "Not Authenticated" });
});


app.post("/api/cart",(req: Request, res: Response) => {
  if(!req.session.user){
    res.status(401).send({ msg: "Not Authenticated" });
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
  }
 res.status(200).send(req.session.cart ? req.session.cart : []);
});
