import express, { Request, Response } from 'express';
import users from "./routes/users";
import products from "./routes/products";
import cookieParser from 'cookie-parser';
import session, { SessionData } from "express-session"

declare module 'express-session' {
  interface SessionData {
    visited?: boolean;
  }
}

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(users);
app.use(products);
app.use(session({
  secret:"secure",
  saveUninitialized: true,
  resave:false,
  cookie: { 
    maxAge: 60000 * 60,
    secure: false, 
  },
}));
app.use(cookieParser("secure"));

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password:"fjsdsjjhwhe" },
    { id: 2, name: 'Mike Rose', email: 'mike01@example.com',password: "nbsjfdbsjjhwke" },
];

app.get("/",(req: Request, res: Response) => {
  console.log(req.session);
  console.log(req.session.id);
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

app.post("/api/auth",(req: Request, res: Response) => {
const { 
  body: { name , password }
 } = req;
const findUser = mockUsers.find(user => user.name === name);
if(!findUser || findUser?.password !== password) 
  res.status(401).send({ msg: "Bad Credentials "});

// req.session.user = findUser;
res.status(200).send(findUser);

});

app.get("/api/auth/status",(req: Request, res: Response) => {
//  req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({ msg: "Bad Credentials "});
});
