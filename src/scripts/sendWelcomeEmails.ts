import path from 'path';
import dotenv from 'dotenv';

// Ensure .env is loaded regardless of cPanel cron working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import { pool } from '../config/db';
import { sendMail } from '../config/email';
import { getWelcomeEmailHtml, getWelcomeEmailSubject } from '../templates/welcomeEmail';

export interface WelcomeUser {
  id: string;
  email: string;
  name?: string | null;
}

/**
 * Sends a welcome email to a single user and marks them as sent in the database.
 */
export async function sendWelcomeEmailToUser(user: WelcomeUser): Promise<boolean> {
  if (!user.email) return false;

  try {
    const subject = getWelcomeEmailSubject(user.name);
    const html = getWelcomeEmailHtml({ name: user.name, email: user.email });

    const result = await sendMail({
      to: user.email,
      subject,
      html,
    });

    if (result.success) {
      // Record sent email in dedicated tracking table
      await pool.query(
        `INSERT INTO welcome_email_logs (user_id, email, sent_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id) DO NOTHING;`,
        [String(user.id), user.email]
      );

      // Also attempt to update users table if column exists, ignore if not
      await pool.query(
        `UPDATE users
         SET welcome_email_sent = true,
             welcome_email_sent_at = NOW()
         WHERE id = $1`,
        [user.id]
      ).catch(() => {});

      console.log(`[Welcome Email] Successfully sent welcome email to: ${user.email}`);
      return true;
    } else {
      console.error(`[Welcome Email] Failed to send to ${user.email}:`, result.error);
      return false;
    }
  } catch (err) {
    console.error(`[Welcome Email] Error sending to ${user.email}:`, err);
    return false;
  }
}

/**
 * Main cron job runner to process pending welcome emails.
 */
export async function runWelcomeEmailCron(limit = 25): Promise<{ processed: number; sent: number }> {
  console.log(`[Welcome Cron] Starting welcome email cron job at ${new Date().toISOString()}...`);

  try {
    // Ensure dedicated tracking table exists (owned by this DB user, never requires ALTER TABLE users)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS welcome_email_logs (
        user_id TEXT PRIMARY KEY,
        email TEXT,
        sent_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Find customers who have not received their welcome email
    const query = `
      SELECT u.id, u.email, u.name, u.created_at
      FROM users u
      LEFT JOIN welcome_email_logs w ON u.id::text = w.user_id
      WHERE u.role = 'customer'
        AND w.user_id IS NULL
        AND u.email IS NOT NULL
      ORDER BY u.created_at ASC
      LIMIT $1;
    `;

    const { rows } = await pool.query<WelcomeUser>(query, [limit]);

    if (rows.length === 0) {
      console.log('[Welcome Cron] No pending welcome emails to send.');
      return { processed: 0, sent: 0 };
    }

    console.log(`[Welcome Cron] Found ${rows.length} pending user(s). Processing...`);

    let sentCount = 0;
    for (const user of rows) {
      const ok = await sendWelcomeEmailToUser(user);
      if (ok) sentCount++;
      // Polite 500ms pause between emails to avoid tripping SMTP rate limits
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`[Welcome Cron] Finished. Successfully sent ${sentCount}/${rows.length} welcome emails.`);
    return { processed: rows.length, sent: sentCount };
  } catch (err) {
    console.error('[Welcome Cron] Fatal error during cron execution:', err);
    return { processed: 0, sent: 0 };
  }
}

// When executed directly from CLI / cPanel Cron Job
if (require.main === module) {
  runWelcomeEmailCron()
    .then(async () => {
      console.log('[Welcome Cron] Process completed successfully.');
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[Welcome Cron] Process exited with error:', err);
      await pool.end().catch(() => {});
      process.exit(1);
    });
}
