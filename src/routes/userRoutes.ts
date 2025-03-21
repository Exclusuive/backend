// src/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

// **User Routes**
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);
router.post("/users", UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

export default router;
