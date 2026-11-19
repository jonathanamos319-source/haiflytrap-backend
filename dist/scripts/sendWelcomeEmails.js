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
            await db_1.pool.query(`UPDATE users
         SET welcome_email_sent = true,
             welcome_email_sent_at = NOW()
         WHERE id = $1`, [user.id]);
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
        // Ensure tracking columns exist
        await db_1.pool.query(`
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