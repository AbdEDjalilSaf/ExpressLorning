import { Request, Response } from 'express';
import { mockUsers } from "../utils/containes";

declare module 'express' {
    interface Request {
        userIndex?: number;
    }
}


export const resolveIndexByUserById = (req: Request, res: Response, next: () => void): void => {
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