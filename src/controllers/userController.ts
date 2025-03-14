import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/userModel";

// **Get All Users**
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err); // Pass error to Express error handler
  }
};

// **Get User by ID**
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// **Create New User**
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = await UserModel.createUser(req.body);
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    next(err);
  }
};

// **Update User**
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedUser = await UserModel.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (err) {
    next(err);
  }
};

// **Delete User**
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedUser = await UserModel.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted", user: deletedUser });
  } catch (err) {
    next(err);
  }
};
