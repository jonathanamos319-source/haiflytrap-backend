import Redis from 'ioredis';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

let redisClient: Redis | null = null;
let isConnected = false;

const host = process.env.REDIS_HOST || '127.0.0.1';
const port = parseInt(process.env.REDIS_PORT || '6379', 10);
const password = process.env.REDIS_PASSWORD || undefined;

// Only instantiate Redis if port or host is explicitly provided
if (process.env.REDIS_PORT || process.env.REDIS_HOST) {
  try {
    redisClient = new Redis({
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
  } catch (err) {
    console.warn('[Redis] Initialization error, using DB fallback:', err);
    redisClient = null;
  }
}

/**
 * Checks if Redis is currently connected and usable
 */
export function isRedisAvailable(): boolean {
  return isConnected && redisClient !== null && redisClient.status === 'ready';
}

/**
 * Get cached JSON data by key
 */
export async function getJsonCache<T>(key: string): Promise<T | null> {
  if (!isRedisAvailable() || !redisClient) return null;
  try {
    const raw = await redisClient.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[Redis] Error getting key ${key}:`, err);
    return null;
  }
}

/**
 * Set cached JSON data with an optional TTL (defaults to 1 hour = 3600s)
 */
export async function setJsonCache<T>(key: string, data: T, ttlSeconds = 3600): Promise<void> {
  if (!isRedisAvailable() || !redisClient) return;
  try {
    const payload = JSON.stringify(data);
    if (ttlSeconds > 0) {
      await redisClient.setex(key, ttlSeconds, payload);
    } else {
      await redisClient.set(key, payload);
    }
  } catch (err) {
    console.warn(`[Redis] Error setting key ${key}:`, err);
  }
}

/**
 * Invalidate all keys matching a specific pattern (e.g. "cache:products:*")
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  if (!isRedisAvailable() || !redisClient) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
      console.log(`[Redis] Purged ${keys.length} keys matching: ${pattern}`);
    }
  } catch (err) {
    console.warn(`[Redis] Error clearing pattern ${pattern}:`, err);
  }
}

/**
 * Invalidate product storefront caches whenever admin updates or deletes products
 */
export async function invalidateProductCache(): Promise<void> {
  await deleteCachePattern('cache:products*');
}

/**
 * Invalidate blog caches whenever admin adds or updates blogs
 */
export async function invalidateBlogCache(): Promise<void> {
  await deleteCachePattern('cache:blogs*');
}

// ─── OTP Session Store ────────────────────────────────────────────────────────

export interface RedisOtpData {
  code: string;
  name?: string;
  attempts?: number;
}

/**
 * Store an OTP with a 10-minute auto-expiry (survives server restarts and multi-worker Passenger instances)
 */
export async function storeRedisOtp(
  email: string,
  code: string,
  name?: string,
  ttlSeconds = 600
): Promise<boolean> {
  if (!isRedisAvailable() || !redisClient) return false;
  try {
    const key = `otp:${email.toLowerCase().trim()}`;
    const payload: RedisOtpData = {
      code: code.trim(),
      name: name?.trim(),
      attempts: 0,
    };
    await redisClient.setex(key, ttlSeconds, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn(`[Redis] Failed to store OTP for ${email}:`, err);
    return false;
  }
}

/**
 * Verify and consume an OTP (one-time use, with attempt limit)
 * Returns { success: boolean; name?: string; error?: string } or null if Redis unavailable/not found
 */
export async function verifyRedisOtp(
  email: string,
  candidateOtp: string
): Promise<{ success: boolean; name?: string; error?: string } | null> {
  if (!isRedisAvailable() || !redisClient) return null; // null signals fallback to memory
  try {
    const key = `otp:${email.toLowerCase().trim()}`;
    const raw = await redisClient.get(key);
    if (!raw) return null; // Not found in Redis, let in-memory check

    let data: RedisOtpData;
    try {
      data = JSON.parse(raw);
    } catch {
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
    } else {
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
  } catch (err) {
    console.warn(`[Redis] Error verifying OTP for ${email}:`, err);
    return null;
  }
}

// ─── Real-Time Visitor Metrics ────────────────────────────────────────────────

/**
 * Record a visitor ping in a Redis Sorted Set with 3-minute sliding window
 */
export async function recordVisitorPing(visitorId: string): Promise<void> {
  if (!isRedisAvailable() || !redisClient) return;
  try {
    const key = 'metrics:active_visitors';
    const now = Date.now();
    await redisClient.zadd(key, now, visitorId);
    // Expire entries older than 3 minutes (180,000 ms)
    const threeMinutesAgo = now - 3 * 60 * 1000;
    await redisClient.zremrangebyscore(key, 0, threeMinutesAgo);
    await redisClient.expire(key, 300);
  } catch (err) {
    console.warn('[Redis] Error recording visitor ping:', err);
  }
}

/**
 * Get count of active visitors in the last 3 minutes
 */
export async function getActiveVisitorsCount(): Promise<number> {
  if (!isRedisAvailable() || !redisClient) return 1;
  try {
    const key = 'metrics:active_visitors';
    const now = Date.now();
    const threeMinutesAgo = now - 3 * 60 * 1000;
    await redisClient.zremrangebyscore(key, 0, threeMinutesAgo);
    const count = await redisClient.zcard(key);
    return Math.max(count, 1);
  } catch (err) {
    console.warn('[Redis] Error getting active visitors:', err);
    return 1;
  }
}

export default redisClient;
