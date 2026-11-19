"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config();
const db_1 = require("../config/db");
async function migrate() {
    console.log('[Migration] Adding welcome email tracking columns to users table...');
    try {
        await db_1.pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT false;');
        await db_1.pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ;');
        console.log('✅ Columns welcome_email_sent and welcome_email_sent_at added successfully!');
    }
    catch (err) {
        console.error('❌ Error altering users table:', err);
        process.exit(1);
    }
    finally {
        await db_1.pool.end();
    }
}
migrate();
//# sourceMappingURL=migrateWelcomeColumns.js.map