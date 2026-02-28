import { LRUCache } from 'lru-cache'
import type { NextRequest } from 'next/server'

interface RateLimitOptions {
  uniqueTokenPerInterval?: number // max number of unique tokens per interval
  interval?: number // time window in milliseconds
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: Date
}

// Create a new rate limiter instance
export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // default 1 minute
  })

  return {
    check: async (
      request: NextRequest,
      limit: number
    ): Promise<RateLimitResult> => {
      const token = getClientIdentifier(request)
      const tokenCount = (tokenCache.get(token) as number[]) || [0]
      const currentUsage = tokenCount[0]

      if (currentUsage >= limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset: new Date(Date.now() + (options?.interval || 60000)),
        }
      }

      tokenCount[0] = currentUsage + 1
      tokenCache.set(token, tokenCount)

      return {
        success: true,
        limit,
        remaining: limit - (currentUsage + 1),
        reset: new Date(Date.now() + (options?.interval || 60000)),
      }
    },
  }
}

// Get a unique identifier for the client
function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  const ip =
    forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown'

  const userAgent = request.headers.get('user-agent') || 'unknown'

  return `${ip}:${userAgent}`
}

// Pre-configured rate limiters for different endpoints
export const contactRateLimiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 1000,
})
