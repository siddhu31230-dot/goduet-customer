/**
 * GoDuet Sliding-Window Rate Limiter
 * Defends against brute-force, credential stuffing, and DoS attacks
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired rate limit buckets periodically without holding the event loop open
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter(ts => now - ts < 300000); // Keep last 5 mins
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

if (typeof cleanupTimer.unref === 'function') {
  cleanupTimer.unref();
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  action: 'auth' | 'otp' | 'order' | 'api' | 'ai' = 'api'
): RateLimitResult {
  const configs: Record<string, { limit: number; windowMs: number }> = {
    auth: { limit: 5, windowMs: 60000 },    // 5 attempts per min
    otp: { limit: 3, windowMs: 60000 },     // 3 OTP sends per min
    order: { limit: 10, windowMs: 60000 },  // 10 orders per min
    api: { limit: 60, windowMs: 60000 },    // 60 requests per min
    ai: { limit: 15, windowMs: 60000 }      // 15 AI assistant queries per min
  };

  const config = configs[action] || configs.api;
  const key = `${action}:${identifier.trim().toLowerCase()}`;
  const now = Date.now();

  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter(ts => now - ts < config.windowMs);

  if (record.timestamps.length >= config.limit) {
    const oldest = record.timestamps[0];
    const resetInSeconds = Math.ceil((oldest + config.windowMs - now) / 1000);
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds)
    };
  }

  // Record this request
  record.timestamps.push(now);
  rateLimitStore.set(key, record);

  const remaining = config.limit - record.timestamps.length;
  return {
    allowed: true,
    limit: config.limit,
    remaining,
    resetInSeconds: Math.ceil(config.windowMs / 1000)
  };
}
