import { mockUsers } from "../utils/containes";
import { Request, Response } from "express";

export const usersId =  (req: Request, res: Response) => {
    const { userIndex } = req;
    const findUser = mockUsers[userIndex as number];
    if (!findUser) {
      res.status(404).send("User not found");
    }
    res.json(findUser);
  }