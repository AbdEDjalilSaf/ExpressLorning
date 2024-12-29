import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

interface User {
  id: string;
  name: string;
  email: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Mike Rose', email: 'mike01@example.com' },
];


app.get("/", (req: Request, res: Response) => {
  res.status(201)?.send({msg:"Hello, --- World!"});
});

app.get("/api/users", (req: Request, res: Response) => {
  console.log(req.query);
  const filter = req.query.filter as keyof User | undefined;
  const value = req.query.value as string | undefined;
  if (!filter || !value) return res.send(mockUsers);
  if(filter && value ) return res.send(
    mockUsers.filter((user) => user[filter].includes(value))
  );
  res.json({ message: "This is the users API route" });
});


app.get("/api/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const user = mockUsers.find((user) => user.id === id);

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


// app.get("/api/users", (req: Request, res: Response) => {
//   console.log(req.query);
//   const filter = req.query.filter as keyof User | undefined;
//   const value = req.query.value as string | undefined;
//   if (!filter || !value) return res.send(mockUsers);
//   if(filter && value ) return res.send(
//     mockUsers.filter((user) => user[filter].includes(value))
//   );
//   // res.json({ message: "This is the users API route" });
// });



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});