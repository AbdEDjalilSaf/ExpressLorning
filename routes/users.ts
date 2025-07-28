import { Router, Request, Response, NextFunction } from 'express';
import { query,validationResult, body, matchedData, checkSchema } from 'express-validator';
import { validationSchemas } from "../utils/validationSchemas";
// import {  } from "../middlewares/middlewares";
// import { mockUsers } from "../utils/containes";
import { Usere } from "../config/schemas/user"
import { hashPassword } from '../utils/helpers';
import MongoStore from "connect-mongo"
import mongoose from "mongoose";
import session, { SessionData } from "express-session";
import { usersId , postApiUser , putApiUserId , patchApiUserId , deleteApiUserId } from "../handler/users";

// interface User {
//     id: number;
//     name: string;
//     email: string;
//     password: string;
// }


const router = Router();

router.use(session({
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

  
router.get('/api/users',checkSchema(validationSchemas),(req: Request, res: Response): void => {

  console.log("req.session.id ======= ",req.session?.id);  
  
  req.sessionStore.get(req.session.id,(err, sessionData) => {
    if(err){
      console.log("Error getting session data",err);
      throw err;
    }
    console.log("Inside session store Get");
    console.log("sessionData",sessionData);
  });
  
  const filter = req.query.filter as 'name' | 'email' | 'password';
  const value = req.query.value as string;
    if (!filter || !value) {
        res.json(Usere);
        return;
      }
  const result = validationResult(req);
  console.log(result);
  
      if( filter && value ) {
          const filteredUsers = Usere.find((user: { [key: string]: any }) => user[filter] === value);
          res.json(filteredUsers);
          return;
        }
      res.sendStatus(200);
  
});

router.get("/api/users/:id",usersId);

router.post("/api/users", checkSchema(validationSchemas),postApiUser);


router.put("/api/users/:id", putApiUserId);


router.patch("/api/users/:id", patchApiUserId);


router.delete("/api/users/:id", deleteApiUserId);





export default router