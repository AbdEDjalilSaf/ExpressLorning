import express, { Request, Response } from 'express';
import { query,validationResult, body, matchedData } from 'express-validator';

const app = express();
const PORT = 3000;

app.use(express.json());

declare module 'express' {
  interface Request {
    userIndex?: number;
  }
}

interface User {
  id: number;
  name: string;
  email: string;
}

const logger = (req: Request, res: Response, next: () => void) => { 
  console.log(`${req.method} ${req.path}`);
  next();
};

const resolveIndexByUserById = (req: Request, res: Response, next: () => void): void => {
  // Destructure the `id` from the request parameters
  const { id } = req.params;

  // Attempt to parse the `id` to an integer
  const parsedId = parseInt(id);

  // Check if the parsedId is a valid number
  if (isNaN(parsedId)) {
    res.status(400).json({ error: 'Invalid id provided. Id must be a number.' });
    return;
  }

  // Find the index of the user with the matching id
  const userIndex = mockUsers.findIndex((user) => user.id === parsedId);

  // If no user is found, return a 404 error
  if (userIndex === -1) {
    res.status(404).json({ error: `User with id ${parsedId} not found.` });
    return;
  }

  // Attach the found user index to the request object for use in subsequent middleware or route handlers
  req.userIndex = userIndex;

  // Proceed to the next middleware or route handler
  next();
};

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Mike Rose', email: 'mike01@example.com' },
];


app.get("/",(req: Request, res: Response) => {
  res.status(201)?.send({msg:"Hello, --- World!"});
});


// Define a request handler
const userHandler = (req: Request, res: Response): void => {
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
};

// Use the request handler in a route
app.get("/api/users",query("filter").isString().notEmpty().isLength({ min:3,max:7 }) ,userHandler);


app.post("/api/users",[
  body("name").notEmpty()
  .isLength({ min:3, max:32 })
  .withMessage("user name cannot be Empty")
  .isString()
  .withMessage("user name should be String"),
  body("email").notEmpty().isEmail(),
  ]
  ,(req: Request, res: Response): void => {
  // console.log(req.body);
  const data = matchedData(req);
  // const { body } = req;
  const result = validationResult(req);
  if(!result.isEmpty()){
    res.status(400).send({ errors: result.array() });
    return;
  }
  // console.log("=============== matchedData ==================",data);
  const newUser: User = {id:mockUsers[mockUsers.length - 1].id + 1 as number, name: data.name, email: data.email};
  mockUsers.push(newUser);
  res.status(201).send(newUser);
});


app.put("/api/users/:id", resolveIndexByUserById, (req: Request, res: Response) => {  
  const { body, userIndex } = req;
  if (userIndex !== undefined) {
    mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
    console.log("---------------------------------------PUT----------------------------------------");
    res.sendStatus(200);
  } else {
    res.status(400).json({ error: 'User index is undefined.' });
  }
});


app.patch("/api/users/:id",resolveIndexByUserById, (req: Request, res: Response) => {  
  const { body, userIndex } = req;
  if (userIndex !== undefined) {
    mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
    console.log("---------------------------------------PATCH----------------------------------------");
    res.sendStatus(200);
  } else {
    res.status(400).json({ error: 'User index is undefined.' });
  }
});


app.delete("/api/users/:id",resolveIndexByUserById, (req: Request, res: Response) => {
  const { userIndex } = req;
  if (userIndex !== undefined) {
    mockUsers.splice(userIndex, 1);
    res.send(200);
    console.log("---------------------------------------DELETE----------------------------------------");
  } else {
    res.status(400).json({ error: 'User index is undefined.' });
  }
});


app.get("/api/users/:id",resolveIndexByUserById, (req: Request, res: Response) => {
  const { userIndex } = req;
  const findUser = mockUsers[userIndex as number];
  if (!findUser) {
    res.status(404).send("User not found");
  }
  res.json(findUser);
});


app.get("/api/products", (req: Request, res: Response) => {
  res.send([{id:123,name:"chicken breast",price:12.99}]);
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});