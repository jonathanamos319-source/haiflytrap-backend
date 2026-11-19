import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import { pool } from '../config/db';

async function migrate() {
  console.log('[Migration] Adding welcome email tracking columns to users table...');
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT false;');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ;');
    console.log('✅ Columns welcome_email_sent and welcome_email_sent_at added successfully!');
  } catch (err) {
    console.error('❌ Error altering users table:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
