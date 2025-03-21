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
const checkTableExists = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = $1
    );
  `;
    try {
        const res = yield client.query(query, [tableName]);
        return res.rows[0].exists;
    }
    catch (err) {
        console.error(`❌ Error checking ${tableName} table existence:`, err);
        return false;
    }
});
const createUsersTable = () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield client.query(query);
        console.log("✅ users table created successfully");
    }
    catch (err) {
        console.error("❌ Error creating users table:", err);
    }
});
const createCollectionsTable = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    CREATE TABLE collections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      bannerImg TEXT,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
    try {
        yield client.query(query);
        console.log("✅ collections table created successfully");
    }
    catch (err) {
        console.error("❌ Error creating collections table:", err);
    }
});
const checkRowExists = (table) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield client.query(`SELECT COUNT(*) FROM ${table};`);
        return parseInt(res.rows[0].count, 10) > 0;
    }
    catch (err) {
        console.error(`❌ Error checking data in ${table}:`, err);
        return false;
    }
});
const insertSampleUser = () => __awaiter(void 0, void 0, void 0, function* () {
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
        const res = yield client.query(query, values);
        console.log("✅ Sample user inserted:", res.rows[0]);
    }
    catch (err) {
        console.error("❌ Error inserting sample user:", err);
    }
});
const insertSampleCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    INSERT INTO collections (type, name, bannerImg, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
    const values = [
        "Art",
        "Nature Collection",
        "https://example.com/banner.jpg",
        "A collection of nature-inspired art pieces.",
    ];
    try {
        const res = yield client.query(query, values);
        console.log("✅ Sample collection inserted:", res.rows[0]);
    }
    catch (err) {
        console.error("❌ Error inserting sample collection:", err);
    }
});
const setupDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        if (!(yield checkTableExists("users"))) {
            yield createUsersTable();
        }
        else {
            console.log("⚡ users table already exists");
        }
        if (!(yield checkRowExists("users"))) {
            yield insertSampleUser();
        }
        else {
            console.log("⚡ Sample user already exists");
        }
        if (!(yield checkTableExists("collections"))) {
            yield createCollectionsTable();
        }
        else {
            console.log("⚡ collections table already exists");
        }
        if (!(yield checkRowExists("collections"))) {
            yield insertSampleCollection();
        }
        else {
            console.log("⚡ Sample collection already exists");
        }
    }
    catch (err) {
        console.error("❌ Error in setupDatabase:", err);
    }
    finally {
        yield client.end();
    }
});
setupDatabase();
