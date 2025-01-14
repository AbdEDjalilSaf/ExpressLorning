import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

interface User {
  id: number;
  name: string;
  email: string;
}

const logger = (req: Request, res: Response, next: () => void) => { 
  console.log(`${req.method} ${req.path}`);
  next();
};

const resolveIndexByUserById = (req: Request, res: Response, next: () => void) => {
  // const { 
  //   body,
  //   params: { id }
  //  } = req;
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    res.status(400).json("Invalid id");
    return;
  }
  const user = mockUsers.findIndex((user) => user.id === parsedId);
  if (user === -1) {
    res.status(404).json("User not found");
    return;
  }
  // req.index = user;
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
app.get("/api/users", userHandler);


app.post("/api/users", (req: Request, res: Response): void => {
  console.log(req.body);
  const { body } = req;
  const newUser =  {id:mockUsers[mockUsers.length - 1].id + 1 as number, ...body};
  mockUsers.push(newUser);
  res.status(201).send(newUser);
});


app.put("/api/users/:id", (req: Request, res: Response) => {  
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    res.status(400).json("Invalid id");
    return;
  }
  const userIndex = mockUsers.findIndex((user) => user.id === parseInt(id));
  if (userIndex === -1) {
    res.status(404).json("User not found");
    return;
  }
  const { body } = req;
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
  res.send(200);
});


app.patch("/api/users/:id", (req: Request, res: Response) => {  
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    res.status(400).json("Invalid id");
    return;
  }
  const userIndex = mockUsers.findIndex((user) => user.id === parseInt(id));
  if (userIndex === -1) {
    res.status(404).json("User not found");
    return;
  } 
  const { body } = req;
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
  res.send(200);
});


app.delete("/api/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    res.status(400).json("Invalid id");
    return;
  }
  const userIndex = mockUsers.findIndex((user) => user.id === parseInt(id));
  if (userIndex === -1) {
    res.status(404).json("User not found");
    return;
  }
  mockUsers.splice(userIndex, 1);
  res.send(200);
});


app.get("/api/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const user = mockUsers.find((user) => user.id === parseInt(id));
  if (user) {
    const { ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json(  "User not found" );
  }
});


app.get("/api/products", (req: Request, res: Response) => {
  res.send([{id:123,name:"chicken breast",price:12.99}]);
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});