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
      await pool.query(
        `UPDATE users
         SET welcome_email_sent = true,
             welcome_email_sent_at = NOW()
         WHERE id = $1`,
        [user.id]
      );
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
    // Ensure tracking columns exist
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ;
    `).catch(() => {
      // Column might already exist or DDL restricted
    });

    // Find customers who have not received their welcome email
    const query = `
      SELECT id, email, name, created_at
      FROM users
      WHERE role = 'customer'
        AND (welcome_email_sent IS NULL OR welcome_email_sent = false)
        AND email IS NOT NULL
      ORDER BY created_at ASC
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
    .then(() => {
      console.log('[Welcome Cron] Process completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Welcome Cron] Process exited with error:', err);
      process.exit(1);
    });
}
