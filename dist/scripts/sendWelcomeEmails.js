"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmailToUser = sendWelcomeEmailToUser;
exports.runWelcomeEmailCron = runWelcomeEmailCron;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Ensure .env is loaded regardless of cPanel cron working directory
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config();
const db_1 = require("../config/db");
const email_1 = require("../config/email");
const welcomeEmail_1 = require("../templates/welcomeEmail");
/**
 * Sends a welcome email to a single user and marks them as sent in the database.
 */
async function sendWelcomeEmailToUser(user) {
    if (!user.email)
        return false;
    try {
        const subject = (0, welcomeEmail_1.getWelcomeEmailSubject)(user.name);
        const html = (0, welcomeEmail_1.getWelcomeEmailHtml)({ name: user.name, email: user.email });
        const result = await (0, email_1.sendMail)({
            to: user.email,
            subject,
            html,
        });
        if (result.success) {
            // Record sent email in dedicated tracking table
            await db_1.pool.query(`INSERT INTO welcome_email_logs (user_id, email, sent_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id) DO NOTHING;`, [String(user.id), user.email]);
            // Also attempt to update users table if column exists, ignore if not
            await db_1.pool.query(`UPDATE users
         SET welcome_email_sent = true,
             welcome_email_sent_at = NOW()
         WHERE id = $1`, [user.id]).catch(() => { });
            console.log(`[Welcome Email] Successfully sent welcome email to: ${user.email}`);
            return true;
        }
        else {
            console.error(`[Welcome Email] Failed to send to ${user.email}:`, result.error);
            return false;
        }
    }
    catch (err) {
        console.error(`[Welcome Email] Error sending to ${user.email}:`, err);
        return false;
    }
}
/**
 * Main cron job runner to process pending welcome emails.
 */
async function runWelcomeEmailCron(limit = 25) {
    console.log(`[Welcome Cron] Starting welcome email cron job at ${new Date().toISOString()}...`);
    try {
        // Ensure dedicated tracking table exists (owned by this DB user, never requires ALTER TABLE users)
        await db_1.pool.query(`
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
        const { rows } = await db_1.pool.query(query, [limit]);
        if (rows.length === 0) {
            console.log('[Welcome Cron] No pending welcome emails to send.');
            return { processed: 0, sent: 0 };
        }
        console.log(`[Welcome Cron] Found ${rows.length} pending user(s). Processing...`);
        let sentCount = 0;
        for (const user of rows) {
            const ok = await sendWelcomeEmailToUser(user);
            if (ok)
                sentCount++;
            // Polite 500ms pause between emails to avoid tripping SMTP rate limits
            await new Promise(r => setTimeout(r, 500));
        }
        console.log(`[Welcome Cron] Finished. Successfully sent ${sentCount}/${rows.length} welcome emails.`);
        return { processed: rows.length, sent: sentCount };
    }
    catch (err) {
        console.error('[Welcome Cron] Fatal error during cron execution:', err);
        return { processed: 0, sent: 0 };
    }
}
// When executed directly from CLI / cPanel Cron Job
if (require.main === module) {
    runWelcomeEmailCron()
        .then(async () => {
        console.log('[Welcome Cron] Process completed successfully.');
        await db_1.pool.end();
        process.exit(0);
    })
        .catch(async (err) => {
        console.error('[Welcome Cron] Process exited with error:', err);
        await db_1.pool.end().catch(() => { });
        process.exit(1);
    });
}
//# sourceMappingURL=sendWelcomeEmails.js.map