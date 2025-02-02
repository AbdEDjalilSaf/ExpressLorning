import { Router, Request, Response, NextFunction } from 'express';
import { query,validationResult, body, matchedData, checkSchema } from 'express-validator';
import { validationSchemas } from "../utils/validationSchemas";
import { resolveIndexByUserById } from "../middlewares/middlewares";
import { mockUsers } from "../utils/containes";
import { Usere } from "../config/schemas/user"
import { hashPassword } from '../utils/helpers';
import MongoStore from "connect-mongo"
import mongoose from "mongoose";
import session, { SessionData } from "express-session";
import { usersId } from "../handler/users";

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
      res.json(mockUsers);
      return;
    }
const result = validationResult(req);
console.log(result);

    if( filter && value ) {
        const filteredUsers = mockUsers.filter((user) => user[filter].includes(value));
        res.json(filteredUsers);
        return;
      }
      res.json(mockUsers);

});

router.get("/api/users/:id",resolveIndexByUserById,usersId);

router.post("/api/users", checkSchema(validationSchemas) ,async (req: Request, res: Response): Promise<void> => {
  // console.log(req.body);
  // const { body } = req;
  const data = matchedData(req);
  const result = validationResult(req);

  if(!result.isEmpty()){
    res.status(400).send({ errors: result.array() });
    return;
  }

const newAddUser = new Usere(data);
data.password = await hashPassword(data.password);
try{
  await newAddUser.save()
  .then(() => console.log("User saved successfully"))
  .catch((err) => console.error("Error saving user:", err));

  res.status(201).send(newAddUser);
}catch(err){
  console.log("Error ---------------- ",err);
  res.status(400).send({error: (err as Error).message});
  return;
} 
 
  // const { body } = req;
  // // console.log("=============== matchedData ==================",data);
  // const newUser: User = {id:mockUsers[mockUsers.length - 1].id + 1 as number, name: data.name, email: data.email,password: data.password};
  // mockUsers.push(newUser);
  // res.status(201).send(newUser);
});


router.put("/api/users/:id", resolveIndexByUserById, (req: Request, res: Response) => {  
  const { body, userIndex } = req;
  if (userIndex !== undefined) {
    mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
    console.log("---------------------------------------PUT----------------------------------------");
    res.sendStatus(200);
  } else {
    res.status(400).json({ error: 'User index is undefined.' });
  }
});


router.patch("/api/users/:id",resolveIndexByUserById, (req: Request, res: Response) => {  
  const { body, userIndex } = req;
  if (userIndex !== undefined) {
    mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
    console.log("---------------------------------------PATCH----------------------------------------");
    res.sendStatus(200);
  } else {
    res.status(400).json({ error: 'User index is undefined.' });
  }
});


router.delete("/api/users/:id",resolveIndexByUserById, (req: Request, res: Response) => {
  const { userIndex } = req;
  if (userIndex !== undefined) {
    mockUsers.splice(userIndex, 1);
    res.send(200);
    console.log("---------------------------------------DELETE----------------------------------------");
  } else {
    res.status(400).json({ error: 'User index is undefined.' });
  }
});


// router.get("/api/users/:id",resolveIndexByUserById, (req: Request, res: Response) => {
//   const { userIndex } = req;
//   const findUser = mockUsers[userIndex as number];
//   if (!findUser) {
//     res.status(404).send("User not found");
//   }
//   res.json(findUser);
// });




export default router