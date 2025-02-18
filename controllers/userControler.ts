import { Usere } from "../config/schemas/user";   // Import the User model
import { Request, Response } from 'express';



const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await Usere.find(); // Fetch all users from the database
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

 

// Get a single user by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await Usere.findById(req.params.id); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};




// Create a new user
const createUser = async (req:Request, res:Response) => {
  try {
    const user = new Usere(req.body); // Create a new user instance
    await user.save(); // Save the user to the database
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};





// Update a user by ID
const updateUser = async (req:Request, res:Response) => {
  try {
    const user = await Usere.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated user
      runValidators: true, // Validate the update data
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};





// Delete a user by ID
const deleteUser = async (req:Request, res:Response) => {
  try {
    const user = await Usere.findByIdAndDelete(req.params.id); // Delete user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};






module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};