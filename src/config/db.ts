import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// In cPanel shared hosting, local PostgreSQL runs on localhost without SSL.
// Only enable SSL if explicitly requested or connecting to a remote cloud DB.
const isLocal =
  process.env.DATABASE_URL.includes('localhost') ||
  process.env.DATABASE_URL.includes('127.0.0.1') ||
  process.env.DB_SSL === 'false';

const useSSL = process.env.DB_SSL === 'true' || (!isLocal && process.env.NODE_ENV === 'production');

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected pg pool error:', err);
});
