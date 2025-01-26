import { Router, Request, Response } from 'express';
import { query,validationResult, body, matchedData, checkSchema } from 'express-validator';
import { validationSchemas } from "../utils/validationSchemas";
import { resolveIndexByUserById } from "../middlewares/middlewares";

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

const router = Router();

const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password:"fjsdsjjhwhe" },
    { id: 2, name: 'Mike Rose', email: 'mike01@example.com',password: "nbsjfdbsjjhwke" },
];


router.get('/api/users', (req: Request, res: Response): void => {
     const filter = req.query.filter as 'name' | 'email';
      const value = req.query.value as string;
    const result  = validationResult(req);
    console.log(result);
    if (!filter || !value) {
        res.json(mockUsers);
        return;
      }
    if(filter && value ) {
        const filteredUsers = mockUsers.filter((user) => user[filter].includes(value));
        res.json(filteredUsers);
        return;
      }
      res.json(mockUsers);

});

router.get("/api/users/:id",resolveIndexByUserById, (req: Request, res: Response) => {
  const { userIndex } = req;
  const findUser = mockUsers[userIndex as number];
  if (!findUser) {
    res.status(404).send("User not found");
  }
  res.json(findUser);
});

router.post("/api/users", checkSchema(validationSchemas) ,(req: Request, res: Response): void => {
  // console.log(req.body);
  const data = matchedData(req);
  // const { body } = req;
  const result = validationResult(req);
  if(!result.isEmpty()){
    res.status(400).send({ errors: result.array() });
    return;
  }
  // console.log("=============== matchedData ==================",data);
  const newUser: User = {id:mockUsers[mockUsers.length - 1].id + 1 as number, name: data.name, email: data.email,password: data.password};
  mockUsers.push(newUser);
  res.status(201).send(newUser);
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


router.get("/api/users/:id",resolveIndexByUserById, (req: Request, res: Response) => {
  const { userIndex } = req;
  const findUser = mockUsers[userIndex as number];
  if (!findUser) {
    res.status(404).send("User not found");
  }
  res.json(findUser);
});




export default router