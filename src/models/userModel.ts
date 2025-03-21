// src/models/userModel.ts
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
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
export const UserModel = {
  // **Get All Users**
  async getAllUsers() {
    const query = "SELECT * FROM users;";
    const result = await client.query(query);
    return result.rows;
  },

  // **Get User by ID**
  async getUserById(id: string) {
    const query = "SELECT * FROM users WHERE id = $1;";
    const result = await client.query(query, [id]);
    return result.rows[0]; // Return single user
  },

  // **Create New User**
  async createUser(userData: {
    address: string;
    profileImg?: string;
    name: string;
    description?: string;
  }) {
    const { address, profileImg, name, description } = userData;

    const query = `
      INSERT INTO users (address, profileImg, name, description)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [address, profileImg, name, description];

    const result = await client.query(query, values);
    return result.rows[0]; // Return the created user
  },

  // **Update User**
  async updateUser(
    id: string,
    updateData: Partial<{
      address: string;
      profileImg?: string;
      name: string;
      description?: string;
    }>
  ) {
    // Dynamically build the query based on provided fields
    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $${
      Object.keys(updateData).length + 1
    } RETURNING *;`;

    const values = [...Object.values(updateData), id];

    const result = await client.query(query, values);
    return result.rows[0]; // Return updated user
  },

  // **Delete User**
  async deleteUser(id: string) {
    const query = "DELETE FROM users WHERE id = $1 RETURNING *;";
    const result = await client.query(query, [id]);
    return result.rows[0]; // Return deleted user
  },
};
