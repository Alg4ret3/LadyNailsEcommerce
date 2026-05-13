// ─── Simple In-Memory Rate Limiter ───────────────────────────────────────────
// Limits requests per IP to prevent abuse

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 1000      // 1 minute window
const MAX_REQUESTS = 15           // Max requests per window
const CLEANUP_INTERVAL = 5 * 60 * 1000 // Clean expired entries every 5 min

// Periodic cleanup to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Check if a request is allowed under the rate limit.
 */
export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now()
  const entry = store.get(identifier)

  // If no entry or window expired, create new
  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + WINDOW_MS,
    }
    store.set(identifier, newEntry)
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: newEntry.resetAt,
    }
  }

  // Increment count
  entry.count++
  store.set(identifier, entry)

  if (entry.count > MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  }
}
