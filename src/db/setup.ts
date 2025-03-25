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

const checkTableExists = async (tableName: string): Promise<boolean> => {
  const query = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = $1
    );
  `;
  try {
    const res = await client.query(query, [tableName]);
    return res.rows[0].exists;
  } catch (err) {
    console.error(`❌ Error checking ${tableName} table existence:`, err);
    return false;
  }
};

const createUsersTable = async () => {
  const query = `
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      address TEXT NOT NULL UNIQUE,
      profileImg TEXT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
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

const createCollectionsTable = async () => {
  const query = `
    CREATE TABLE collections (
      id VARCHAR(100) PRIMARY KEY NOT NULL,
      name VARCHAR(255) NOT NULL,
      bannerImg TEXT,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  try {
    await client.query(query);
    console.log("✅ collections table created successfully");
  } catch (err) {
    console.error("❌ Error creating collections table:", err);
  }
};

const checkRowExists = async (table: string): Promise<boolean> => {
  try {
    const res = await client.query(`SELECT COUNT(*) FROM ${table};`);
    return parseInt(res.rows[0].count, 10) > 0;
  } catch (err) {
    console.error(`❌ Error checking data in ${table}:`, err);
    return false;
  }
};

const insertSampleUser = async () => {
  const query = `
    INSERT INTO users (address, profileImg, name, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [
    "0x123456789abcdef",
    "https://example.com/avatar.png",
    "Sample User",
    "This is a sample user for testing purposes.",
  ];
  try {
    const res = await client.query(query, values);
    console.log("✅ Sample user inserted:", res.rows[0]);
  } catch (err) {
    console.error("❌ Error inserting sample user:", err);
  }
};

const insertSampleCollection = async () => {
  const query = `
    INSERT INTO collections (id, name, bannerImg, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [
    "0x6yuguigug788t87ghojuj09hguibibo0",
    "Nature Collection",
    "https://example.com/banner.jpg",
    "A collection of nature-inspired art pieces.",
  ];
  try {
    const res = await client.query(query, values);
    console.log("✅ Sample collection inserted:", res.rows[0]);
  } catch (err) {
    console.error("❌ Error inserting sample collection:", err);
  }
};

const setupDatabase = async () => {
  try {
    await client.connect();

    if (!(await checkTableExists("users"))) {
      await createUsersTable();
    } else {
      console.log("⚡ users table already exists");
    }

    if (!(await checkRowExists("users"))) {
      await insertSampleUser();
    } else {
      console.log("⚡ Sample user already exists");
    }

    if (!(await checkTableExists("collections"))) {
      await createCollectionsTable();
    } else {
      console.log("⚡ collections table already exists");
    }

    if (!(await checkRowExists("collections"))) {
      await insertSampleCollection();
    } else {
      console.log("⚡ Sample collection already exists");
    }
  } catch (err) {
    console.error("❌ Error in setupDatabase:", err);
  } finally {
    await client.end();
  }
};

setupDatabase();
