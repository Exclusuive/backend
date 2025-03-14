import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
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
    email: string;
    nickname: string;
    name: string;
    profile_url?: string;
    vegetarian_stage: string;
    vegetarian_start_year: number;
  }) {
    const {
      email,
      nickname,
      name,
      profile_url,
      vegetarian_stage,
      vegetarian_start_year,
    } = userData;

    const query = `
      INSERT INTO users (email, nickname, name, profile_url, vegetarian_stage, vegetarian_start_year)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [
      email,
      nickname,
      name,
      profile_url,
      vegetarian_stage,
      vegetarian_start_year,
    ];

    const result = await client.query(query, values);
    return result.rows[0]; // Return the created user
  },

  // **Update User**
  async updateUser(
    id: string,
    updateData: Partial<{
      email: string;
      nickname: string;
      name: string;
      profile_url?: string;
      vegetarian_stage: string;
      vegetarian_start_year: number;
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
