import { Request, Response } from 'express';
import { mockUsers } from "../utils/containes";
import { Usere } from "../config/schemas/user"

declare module 'express' {
    interface Request {
        userIndex?: number;
    }
}


export const resolveIndexByUserById = async(req: Request, res: Response, next: () => void): Promise<void> => {
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
    const user = await Usere.findById(parsedId);
  
    // If no user is found, return a 404 error
    if (!user) {
      res.status(404).json({ error: `User with id ${parsedId} not found.` });
      return;
    }
  
    // Attach the found user index to the request object for use in subsequent middleware or route handlers
    req.userIndex = user.id;
  
    // Proceed to the next middleware or route handler
    next();
  };