export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Default configuration: 10 requests per 60 seconds (60,000 ms)
export const DEFAULT_RATE_LIMIT = 10;
export const DEFAULT_WINDOW_MS = 60 * 1000;

/**
 * Sliding-window rate limiter
 * @param key unique identifier (e.g. `user:${userId}` or `ip:${ip}`)
 * @param limit maximum allowed requests within the window (default 10)
 * @param windowMs time window in milliseconds (default 60,000ms / 60s)
 */
export function checkRateLimit(
  key: string,
  limit: number = DEFAULT_RATE_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS,
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitMap.get(key) ?? { timestamps: [] };

  // Filter out timestamps outside the active sliding window
  const validTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (validTimestamps.length >= limit) {
    // Exceeded limit. Calculate time until oldest timestamp leaves the window
    const oldestTimestamp = validTimestamps[0];
    const resetTimeMs = oldestTimestamp + windowMs - now;
    const resetInSeconds = Math.max(1, Math.ceil(resetTimeMs / 1000));

    // Update map with cleaned timestamps
    rateLimitMap.set(key, { timestamps: validTimestamps });

    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  // Allow request and record current timestamp
  validTimestamps.push(now);
  rateLimitMap.set(key, { timestamps: validTimestamps });

  const remaining = Math.max(0, limit - validTimestamps.length);
  const oldestTimestamp = validTimestamps[0];
  const resetTimeMs = oldestTimestamp + windowMs - now;
  const resetInSeconds = Math.max(1, Math.ceil(resetTimeMs / 1000));

  return {
    allowed: true,
    remaining,
    resetInSeconds,
  };
}

/**
 * Helper to reset rate limits (primarily for testing)
 */
export function resetRateLimits(): void {
  rateLimitMap.clear();
}
