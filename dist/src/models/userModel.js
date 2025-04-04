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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
// src/models/userModel.ts
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new pg_1.Client({
    user: process.env.PG_USER || "postgres",
    host: process.env.PG_HOST || "localhost",
    database: process.env.PG_DATABASE || "your_database",
    password: process.env.PG_PASSWORD || "your_password",
    port: Number(process.env.PG_PORT) || 5432,
    ssl: {
        rejectUnauthorized: false, // Render의 SSL 인증서가 필요 없음
    },
});
client.connect();
// **Define User Model Functions**
exports.UserModel = {
    // **Get All Users**
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM users;";
            const result = yield client.query(query);
            return result.rows;
        });
    },
    // **Get User by ID**
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM users WHERE id = $1;";
            const result = yield client.query(query, [id]);
            return result.rows[0]; // Return single user
        });
    },
    // **Create New User**
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { address, profileImg, name, description } = userData;
            const query = `
      INSERT INTO users (address, profileImg, name, description)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
            const values = [address, profileImg, name, description];
            const result = yield client.query(query, values);
            return result.rows[0]; // Return the created user
        });
    },
    // **Update User**
    updateUser(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Dynamically build the query based on provided fields
            const setClause = Object.keys(updateData)
                .map((key, index) => `${key} = $${index + 1}`)
                .join(", ");
            const query = `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $${Object.keys(updateData).length + 1} RETURNING *;`;
            const values = [...Object.values(updateData), id];
            const result = yield client.query(query, values);
            return result.rows[0]; // Return updated user
        });
    },
    // **Delete User**
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "DELETE FROM users WHERE id = $1 RETURNING *;";
            const result = yield client.query(query, [id]);
            return result.rows[0]; // Return deleted user
        });
    },
};
