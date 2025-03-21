// src/models/collectionModel.ts
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

  // **Create New Collection**
  async createCollection(collectionData: {
    type: string;
    name: string;
    bannerImg?: string;
    description?: string;
  }) {
    const { type, name, bannerImg, description } = collectionData;

    const query = `
      INSERT INTO collections (type, name, bannerImg, description)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [type, name, bannerImg, description];

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
