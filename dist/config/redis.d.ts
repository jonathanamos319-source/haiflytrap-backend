import Redis from 'ioredis';
declare let redisClient: Redis | null;
/**
 * Checks if Redis is currently connected and usable
 */
export declare function isRedisAvailable(): boolean;
/**
 * Get cached JSON data by key
 */
export declare function getJsonCache<T>(key: string): Promise<T | null>;
/**
 * Set cached JSON data with an optional TTL (defaults to 1 hour = 3600s)
 */
export declare function setJsonCache<T>(key: string, data: T, ttlSeconds?: number): Promise<void>;
/**
 * Invalidate all keys matching a specific pattern (e.g. "cache:products:*")
 */
export declare function deleteCachePattern(pattern: string): Promise<void>;
/**
 * Invalidate product storefront caches whenever admin updates or deletes products
 */
export declare function invalidateProductCache(): Promise<void>;
/**
 * Invalidate blog caches whenever admin adds or updates blogs
 */
export declare function invalidateBlogCache(): Promise<void>;
export interface RedisOtpData {
    code: string;
    name?: string;
    attempts?: number;
}
/**
 * Store an OTP with a 10-minute auto-expiry (survives server restarts and multi-worker Passenger instances)
 */
export declare function storeRedisOtp(email: string, code: string, name?: string, ttlSeconds?: number): Promise<boolean>;
/**
 * Verify and consume an OTP (one-time use, with attempt limit)
 * Returns { success: boolean; name?: string; error?: string } or null if Redis unavailable/not found
 */
export declare function verifyRedisOtp(email: string, candidateOtp: string): Promise<{
    success: boolean;
    name?: string;
    error?: string;
} | null>;
/**
 * Record a visitor ping in a Redis Sorted Set with 3-minute sliding window
 */
export declare function recordVisitorPing(visitorId: string): Promise<void>;
/**
 * Get count of active visitors in the last 3 minutes
 */
export declare function getActiveVisitorsCount(): Promise<number>;
export default redisClient;
//# sourceMappingURL=redis.d.ts.map