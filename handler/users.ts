import { mockUsers } from "../utils/containes";
import { Request, Response } from "express";
import { Usere } from "../config/schemas/user"
import { hashPassword } from '../utils/helpers';
import { query,validationResult, body, matchedData, checkSchema } from 'express-validator';
import { MongoUnexpectedServerResponseError } from "mongodb";





export const usersId = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Assuming the user ID is passed as a URL parameter

  if (!id) {
    res.status(400).json({ error: 'User ID is required.' });
    return; 
  }

  try {
    const user = await Usere.findById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    res.json(user); // Send the user data as a JSON response
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};








export const postApiUser = async (req: Request, res: Response): Promise<void> => {
  // console.log(req.body);
  // const { body } = req;
  const data = matchedData(req);
  const result = validationResult(req);
console.log("result",result);
  if(!result.isEmpty()){
    res.status(400).send({ errors: result.array() });
    return;
  }

const newAddUser = new Usere(data);
data.password = await hashPassword(data.password);
console.log("data",data);
try {
  await newAddUser.save()
  .then(() => console.log("User saved successfully"))
  .catch((err) => console.error("Error saving user:", err));

  res.status(201).send(newAddUser);
} catch(err) {
  console.log("Error ---------------- ",err);
  res.status(400).send({error: (err as Error).message});
  return;
} 
// const { body } = req;
// // console.log("=============== matchedData ==================",data);
// const newUser: User = {id:mockUsers[mockUsers.length - 1].id + 1 as number, name: data.name, email: data.email,password: data.password};
// mockUsers.push(newUser);
// res.status(201).send(newUser);
}








export const putApiUserId = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Extract the user ID from the URL parameters
  const newUserData = req.body; // Extract the new user data from the request body

  console.log("User ID:", id);
  console.log("New User Data:", newUserData);

  if (!id) {
    res.status(400).json({ error: 'User ID is required.' });
    return;
  }

  if (!newUserData || Object.keys(newUserData).length === 0) {
    res.status(400).json({ error: 'New user data is required.' });
    return;
  }


  try {
    // Replace the user document with the new data
    const updatedUser = await Usere.findByIdAndUpdate(
      id,
      newUserData,
      { new: true, runValidators: true, overwrite: true } // Replace the entire document
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    res.status(200).json(updatedUser); // Send the updated user as a response
    console.log("---------------------------------------PUT----------------------------------------");
  } catch (err) {
    console.error("The error is:", err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};







export const patchApiUserId = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Extract the user ID from the URL parameters
  const updateData = req.body; // Extract the update data from the request body

  console.log("User ID:", id);
  console.log("Update Data:", updateData);

  if (!id) {
    res.status(400).json({ error: 'User ID is required.' });
    return;
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    res.status(400).json({ error: 'Update data is required.' });
    return;
  }

  try {
    // Find the user by ID and update the specified fields
    const updatedUser = await Usere.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    res.status(200).json(updatedUser); // Send the updated user as a response
    console.log("---------------------------------------PATCH----------------------------------------");
  } catch (err) {
    console.error("The error is:", err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};








export const deleteApiUserId = async(req: Request, res: Response):Promise<void> => {
  const { id } = req.params;
  console.log("userIndex",id);

  if (!id) {
    res.status(400).json({ error: 'User ID is required.' });
    return;
  }

  try {
  const deletedUser = await Usere.findByIdAndDelete(id);

  if (!deletedUser) {
    res.status(404).json({ error: 'User not found.' });
  }

  res.sendStatus(200);
  console.log("---------------------------------------DELETE----------------------------------------");
  } catch (err) {
    console.log(" the error is ",err);
    res.status(500).json({ error: 'Internal server error.' });
}
}