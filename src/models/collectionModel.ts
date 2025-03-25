// src/models/collectionModel.ts
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

// **Define Collection Model Functions**
export const CollectionModel = {
  // **Get All Collections**
  async getAllCollections() {
    const query = "SELECT * FROM collections;";
    const result = await client.query(query);
    return result.rows;
  },

  // **Get Collection by ID**
  async getCollectionById(id: string) {
    const query = "SELECT * FROM collections WHERE id = $1;";
    const result = await client.query(query, [id]);
    return result.rows[0]; // Return single collection
  },

  async getCollectionsByObjectIds(objectIds: string[]) {
    if (objectIds.length === 0) return [];

    const placeholders = objectIds
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    const query = `SELECT * FROM collections WHERE id IN (${placeholders});`;

    const result = await client.query(query, objectIds);
    return result.rows;
  },

  // **Create New Collection**
  async createCollection(collectionData: {
    id: string;
    name: string;
    bannerImg?: string;
    description?: string;
  }) {
    const { id, name, bannerImg, description } = collectionData;

    const query = `
      INSERT INTO collections (id, name, bannerImg, description)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [id, name, bannerImg, description];

    const result = await client.query(query, values);
    return result.rows[0]; // Return the created collection
  },

  // **Update Collection**
  async updateCollection(
    id: string,
    updateData: Partial<{
      type: string;
      name: string;
      bannerImg?: string;
      description?: string;
    }>
  ) {
    // Dynamically build the query based on provided fields
    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = `UPDATE collections SET ${setClause}, updated_at = NOW() WHERE id = $${
      Object.keys(updateData).length + 1
    } RETURNING *;`;

    const values = [...Object.values(updateData), id];

    const result = await client.query(query, values);
    return result.rows[0]; // Return updated collection
  },

  // **Delete Collection**
  async deleteCollection(id: string) {
    const query = "DELETE FROM collections WHERE id = $1 RETURNING *;";
    const result = await client.query(query, [id]);
    return result.rows[0]; // Return deleted collection
  },
};
