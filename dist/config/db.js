"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}
// In cPanel shared hosting, local PostgreSQL runs on localhost without SSL.
// Only enable SSL if explicitly requested or connecting to a remote cloud DB.
const isLocal = process.env.DATABASE_URL.includes('localhost') ||
    process.env.DATABASE_URL.includes('127.0.0.1') ||
    process.env.DB_SSL === 'false';
const useSSL = process.env.DB_SSL === 'true' || (!isLocal && process.env.NODE_ENV === 'production');
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});
exports.pool.on('error', (err) => {
    console.error('Unexpected pg pool error:', err);
});
//# sourceMappingURL=db.js.map