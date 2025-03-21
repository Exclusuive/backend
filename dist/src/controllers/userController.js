"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userModel_1 = require("../models/userModel");
exports.UserController = {
    // **Get All Users**
    getAllUsers: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield userModel_1.UserModel.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch users." });
        }
    })),
    // **Get User by ID**
    getUserById: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield userModel_1.UserModel.getUserById(id);
            if (!user)
                return res.status(404).json({ error: "User not found." });
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch user." });
        }
    })),
    // **Create New User**
    createUser: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userData = req.body;
            const newUser = yield userModel_1.UserModel.createUser(userData);
            res.status(201).json(newUser);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create user." });
        }
    })),
    // **Update User**
    updateUser: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedUser = yield userModel_1.UserModel.updateUser(id, updateData);
            if (!updatedUser)
                return res.status(404).json({ error: "User not found." });
            res.status(200).json(updatedUser);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update user." });
        }
    })),
    // **Delete User**
    deleteUser: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const deletedUser = yield userModel_1.UserModel.deleteUser(id);
            if (!deletedUser)
                return res.status(404).json({ error: "User not found." });
            res.status(200).json(deletedUser);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete user." });
        }
    })),
};
