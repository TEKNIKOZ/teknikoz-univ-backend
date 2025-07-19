import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const database = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Test database connection
const testConnection = async () => {
  try {
    const result = await database.query('SELECT 1');
    if (result.rows.length === 0) throw new Error('Database connection failed');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

// Test connection on startup
testConnection();

console.log('Database configuration loaded');