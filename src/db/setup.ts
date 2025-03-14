import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "your_database",
  password: process.env.PG_PASSWORD || "your_password",
  port: Number(process.env.PG_PORT) || 5432,
});

const checkTableExists = async (): Promise<boolean> => {
  const query = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'users'
    );
  `;

  try {
    const res = await client.query(query);
    return res.rows[0].exists;
  } catch (err) {
    console.error("❌ Error checking users table existence:", err);
    return false;
  }
};

const createUsersTable = async () => {
  const query = `
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) NOT NULL UNIQUE,
      nickname VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      profile_url TEXT,
      vegetarian_stage VARCHAR(50) NOT NULL,
      vegetarian_start_year INT NOT NULL,
      community_points INT NOT NULL DEFAULT 0,
      push_notification BOOLEAN NOT NULL DEFAULT TRUE,
      advertising_consent BOOLEAN NOT NULL DEFAULT FALSE,
      like_notification BOOLEAN NOT NULL DEFAULT TRUE,
      comment_notification BOOLEAN NOT NULL DEFAULT TRUE,
      message_notification BOOLEAN NOT NULL DEFAULT TRUE,
      usage_restriction TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  try {
    await client.query(query);
    console.log("✅ users table created successfully");
  } catch (err) {
    console.error("❌ Error creating users table:", err);
  }
};

const checkUserExists = async (): Promise<boolean> => {
  const query = "SELECT COUNT(*) FROM users;";
  try {
    const res = await client.query(query);
    return parseInt(res.rows[0].count, 10) > 0;
  } catch (err) {
    console.error("❌ Error checking user existence:", err);
    return false;
  }
};

const insertSampleUser = async () => {
  const query = `
    INSERT INTO users (email, nickname, name, profile_url, vegetarian_stage, vegetarian_start_year)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    "test@example.com",
    "testuser",
    "Test User",
    "https://example.com/profile.jpg",
    "Vegan",
    2020,
  ];

  try {
    const res = await client.query(query, values);
    console.log("✅ Sample user inserted:", res.rows[0]);
  } catch (err) {
    console.error("❌ Error inserting sample user:", err);
  }
};

const setupDatabase = async () => {
  try {
    await client.connect();

    const tableExists = await checkTableExists();
    if (!tableExists) {
      await createUsersTable();
    } else {
      console.log("⚡ users table already exists, skipping creation.");
    }

    const userExists = await checkUserExists();
    if (!userExists) {
      await insertSampleUser();
    } else {
      console.log("⚡ Sample user already exists, skipping insertion.");
    }
  } catch (err) {
    console.error("❌ Error in setupDatabase:", err);
  } finally {
    await client.end();
  }
};

setupDatabase();
