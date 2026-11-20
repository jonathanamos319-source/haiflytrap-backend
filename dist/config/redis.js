"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRedisAvailable = isRedisAvailable;
exports.getJsonCache = getJsonCache;
exports.setJsonCache = setJsonCache;
exports.deleteCachePattern = deleteCachePattern;
exports.invalidateProductCache = invalidateProductCache;
exports.invalidateBlogCache = invalidateBlogCache;
exports.storeRedisOtp = storeRedisOtp;
exports.verifyRedisOtp = verifyRedisOtp;
const ioredis_1 = __importDefault(require("ioredis"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config();
let redisClient = null;
let isConnected = false;
const host = process.env.REDIS_HOST || '127.0.0.1';
const port = parseInt(process.env.REDIS_PORT || '6379', 10);
const password = process.env.REDIS_PASSWORD || undefined;
// Only instantiate Redis if port or host is explicitly provided
if (process.env.REDIS_PORT || process.env.REDIS_HOST) {
    try {
        redisClient = new ioredis_1.default({
            host,
            port,
            password,
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            connectTimeout: 4000,
            retryStrategy: (times) => {
                if (times > 3) {
                    console.warn('[Redis] Connection retries exhausted. Running in direct database mode.');
                    return null; // Stop retrying and fallback to DB
                }
                return Math.min(times * 1000, 3000);
            },
        });
        redisClient.on('connect', () => {
            isConnected = true;
            console.log(`⚡ [Redis] Connected successfully to ${host}:${port}`);
        });
        redisClient.on('error', (err) => {
            isConnected = false;
            console.warn('[Redis] Connection warning (fallback to DB):', err.message);
        });
        redisClient.on('close', () => {
            isConnected = false;
        });
        // Initiate connection asynchronously without blocking server startup
        redisClient.connect().catch((err) => {
            console.warn('[Redis] Initial connect failed, using DB fallback:', err.message);
        });
    }
    catch (err) {
        console.warn('[Redis] Initialization error, using DB fallback:', err);
        redisClient = null;
    }
}
/**
 * Checks if Redis is currently connected and usable
 */
function isRedisAvailable() {
    return isConnected && redisClient !== null && redisClient.status === 'ready';
}
/**
 * Get cached JSON data by key
 */
async function getJsonCache(key) {
    if (!isRedisAvailable() || !redisClient)
        return null;
    try {
        const raw = await redisClient.get(key);
        if (!raw)
            return null;
        return JSON.parse(raw);
    }
    catch (err) {
        console.warn(`[Redis] Error getting key ${key}:`, err);
        return null;
    }
}
/**
 * Set cached JSON data with an optional TTL (defaults to 1 hour = 3600s)
 */
async function setJsonCache(key, data, ttlSeconds = 3600) {
    if (!isRedisAvailable() || !redisClient)
        return;
    try {
        const payload = JSON.stringify(data);
        if (ttlSeconds > 0) {
            await redisClient.setex(key, ttlSeconds, payload);
        }
        else {
            await redisClient.set(key, payload);
        }
    }
    catch (err) {
        console.warn(`[Redis] Error setting key ${key}:`, err);
    }
}
/**
 * Invalidate all keys matching a specific pattern (e.g. "cache:products:*")
 */
async function deleteCachePattern(pattern) {
    if (!isRedisAvailable() || !redisClient)
        return;
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(...keys);
            console.log(`[Redis] Purged ${keys.length} keys matching: ${pattern}`);
        }
    }
    catch (err) {
        console.warn(`[Redis] Error clearing pattern ${pattern}:`, err);
    }
}
/**
 * Invalidate product storefront caches whenever admin updates or deletes products
 */
async function invalidateProductCache() {
    await deleteCachePattern('cache:products*');
}
/**
 * Invalidate blog caches whenever admin adds or updates blogs
 */
async function invalidateBlogCache() {
    await deleteCachePattern('cache:blogs*');
}
/**
 * Store an OTP with a 10-minute auto-expiry (survives server restarts and multi-worker Passenger instances)
 */
async function storeRedisOtp(email, code, name, ttlSeconds = 600) {
    if (!isRedisAvailable() || !redisClient)
        return false;
    try {
        const key = `otp:${email.toLowerCase().trim()}`;
        const payload = {
            code: code.trim(),
            name: name?.trim(),
            attempts: 0,
        };
        await redisClient.setex(key, ttlSeconds, JSON.stringify(payload));
        return true;
    }
    catch (err) {
        console.warn(`[Redis] Failed to store OTP for ${email}:`, err);
        return false;
    }
}
/**
 * Verify and consume an OTP (one-time use, with attempt limit)
 * Returns { success: boolean; name?: string; error?: string } or null if Redis unavailable/not found
 */
async function verifyRedisOtp(email, candidateOtp) {
    if (!isRedisAvailable() || !redisClient)
        return null; // null signals fallback to memory
    try {
        const key = `otp:${email.toLowerCase().trim()}`;
        const raw = await redisClient.get(key);
        if (!raw)
            return null; // Not found in Redis, let in-memory check
        let data;
        try {
            data = JSON.parse(raw);
        }
        catch {
            // Plain text code fallback
            data = { code: raw.trim() };
        }
        const attempts = (data.attempts || 0) + 1;
        if (attempts > 5) {
            await redisClient.del(key);
            return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
        }
        if (data.code === candidateOtp.trim()) {
            await redisClient.del(key); // Invalidate immediately upon successful verification
            return { success: true, name: data.name };
        }
        else {
            // Increment attempt count in Redis with remaining TTL
            const ttl = await redisClient.ttl(key);
            if (ttl > 0) {
                data.attempts = attempts;
                await redisClient.setex(key, ttl, JSON.stringify(data));
            }
            const remaining = 5 - attempts;
            return {
                success: false,
                error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
            };
        }
    }
    catch (err) {
        console.warn(`[Redis] Error verifying OTP for ${email}:`, err);
        return null;
    }
}
exports.default = redisClient;
//# sourceMappingURL=redis.js.map