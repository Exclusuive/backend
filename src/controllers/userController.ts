// src/controllers/userController.ts
import { Request, Response, RequestHandler } from "express";
import { UserModel } from "../models/userModel";

export const UserController = {
  // **Get All Users**
  getAllUsers: (async (req: Request, res: Response) => {
    try {
      const users = await UserModel.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users." });
    }
  }) as RequestHandler,

  // **Get User by ID**
  getUserById: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserModel.getUserById(id);
      if (!user) return res.status(404).json({ error: "User not found." });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user." });
    }
  }) as unknown as RequestHandler,

  // **Create New User**
  createUser: (async (req: Request, res: Response) => {
    try {
      const userData = req.body;
      const newUser = await UserModel.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user." });
    }
  }) as RequestHandler,

  // **Update User**
  updateUser: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedUser = await UserModel.updateUser(id, updateData);
      if (!updatedUser)
        return res.status(404).json({ error: "User not found." });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user." });
    }
  }) as unknown as RequestHandler,

  // **Delete User**
  deleteUser: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedUser = await UserModel.deleteUser(id);
      if (!deletedUser)
        return res.status(404).json({ error: "User not found." });
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user." });
    }
  }) as unknown as RequestHandler,
};
