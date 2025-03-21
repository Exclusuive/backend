"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// **User Routes**
router.get("/users", userController_1.UserController.getAllUsers);
router.get("/users/:id", userController_1.UserController.getUserById);
router.post("/users", userController_1.UserController.createUser);
router.put("/users/:id", userController_1.UserController.updateUser);
router.delete("/users/:id", userController_1.UserController.deleteUser);
exports.default = router;
