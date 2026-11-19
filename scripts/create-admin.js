/**
 * Plain Node.js CLI script to create or reset an admin or handler user.
 * Runs directly on cPanel with: node scripts/create-admin.js
 *
 * Usage:
 *   node scripts/create-admin.js admin <email> <password> [name]
 *   node scripts/create-admin.js handler <phone> [password] [name] [zone]
 */

const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { pool } = require('../dist/config/db');

async function run() {
  const args = process.argv.slice(2);
  const roleArg = (args[0] || process.env.ROLE || 'admin').toLowerCase();

  if (roleArg === 'handler') {
    const phone = args[1] || process.env.HANDLER_PHONE;
    const password = args[2] || process.env.HANDLER_PASSWORD || phone;
    const name = args[3] || process.env.HANDLER_NAME || `Handler ${phone}`;
    const zone = args[4] || process.env.HANDLER_ZONE || 'Default Zone';

    if (!phone) {
      console.error('❌ Error: Phone number is required for handler creation.');
      console.error('Usage: node scripts/create-admin.js handler <phone> [password] [name] [zone]');
      process.exit(1);
    }

    const dummyEmail = `${phone.trim()}@handler.haifly.com`;
    const passwordHash = await bcrypt.hash(password.trim(), 10);

    try {
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [dummyEmail]);
      let userId;

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id;
        await pool.query(
          'UPDATE users SET password_hash = $1, name = $2, role = $3 WHERE id = $4',
          [passwordHash, name, 'handler', userId]
        );
        console.log(`✅ Updated existing user for handler (Email: ${dummyEmail})`);
      } else {
        const newUser = await pool.query(
          `INSERT INTO users (email, password_hash, name, role)
           VALUES ($1, $2, $3, 'handler')
           RETURNING id`,
          [dummyEmail, passwordHash, name]
        );
        userId = newUser.rows[0].id;
        console.log(`✅ Created user account for handler (ID: ${userId}, Email: ${dummyEmail})`);
      }

      const existingHandler = await pool.query('SELECT id FROM handlers WHERE phone = $1', [phone.trim()]);
      if (existingHandler.rows.length > 0) {
        await pool.query(
          'UPDATE handlers SET user_id = $1, name = $2, zone = $3 WHERE phone = $4',
          [userId, name, zone, phone.trim()]
        );
        console.log(`✅ Updated handlers table record for phone: ${phone}`);
      } else {
        await pool.query(
          `INSERT INTO handlers (user_id, name, phone, zone, status)
           VALUES ($1, $2, $3, $4, 'active')`,
          [userId, name, phone.trim(), zone]
        );
        console.log(`✅ Inserted handler record in handlers table for phone: ${phone}`);
      }

      console.log('🎉 Handler setup complete.');
    } catch (err) {
      console.error('❌ Error creating handler:', err);
      process.exit(1);
    } finally {
      await pool.end();
    }
    return;
  }

  // Admin creation / reset
  const email = (args[1] || process.env.ADMIN_EMAIL || (roleArg !== 'admin' ? roleArg : null))?.toLowerCase()?.trim();
  const password = args[2] || process.env.ADMIN_PASSWORD;
  const name = args[3] || process.env.ADMIN_NAME || 'Super Admin';

  if (!email || !password) {
    console.error('❌ Error: Email and password are required for admin creation.');
    console.error('Usage: node scripts/create-admin.js admin <email> <password> [name]');
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(password.trim(), 10);
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      const result = await pool.query(
        `UPDATE users
         SET password_hash = $1, name = $2, role = 'admin'
         WHERE email = $3
         RETURNING id, email, name, role`,
        [passwordHash, name, email]
      );
      console.log('✅ Successfully reset admin credentials for:', result.rows[0]);
    } else {
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, role)
         VALUES ($1, $2, $3, 'admin')
         RETURNING id, email, name, role, created_at`,
        [email, passwordHash, name]
      );
      console.log('✅ Successfully created new admin user:', result.rows[0]);
    }
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
