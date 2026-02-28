/**
 * Server-side Turnstile verification for Next.js API routes
 */

// Turnstile error codes as per Cloudflare documentation
export type TurnstileErrorCode =
  | 'missing-input-secret'
  | 'invalid-input-secret'
  | 'missing-input-response'
  | 'invalid-input-response'
  | 'invalid-widget-id'
  | 'invalid-parsed-secret'
  | 'bad-request'
  | 'timeout-or-duplicate'
  | 'internal-error'
  // Custom error codes for our implementation
  | 'missing-secret-key'
  | 'api-error'
  | 'network-error'

export interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: TurnstileErrorCode[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

/**
 * Verify a Turnstile token on the server side
 * @param token - The Turnstile token from the client
 * @param remoteIp - Optional remote IP address for additional validation
 * @returns Verification result from Cloudflare
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<TurnstileVerifyResponse> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured')
    return {
      success: false,
      'error-codes': ['missing-secret-key'],
    }
  }

  if (!token) {
    return {
      success: false,
      'error-codes': ['missing-input-response'],
    }
  }

  const formData = new URLSearchParams()
  formData.append('secret', secretKey)
  formData.append('response', token)
  if (remoteIp) {
    formData.append('remoteip', remoteIp)
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    if (!response.ok) {
      console.error(`Turnstile API returned status ${response.status}`)
      return {
        success: false,
        'error-codes': ['api-error'],
      }
    }

    const data = (await response.json()) as TurnstileVerifyResponse
    return data
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return {
      success: false,
      'error-codes': ['network-error'],
    }
  }
}

/**
 * Middleware helper to check if CAPTCHA should be required
 */
export function isCaptchaRequired(): boolean {
  if (process.env.NODE_ENV === 'production') {
    return true
  }
  return process.env.REQUIRE_CAPTCHA !== 'false'
}

/**
 * Extract client IP from Next.js request headers
 */
export function getClientIp(request: Request): string | undefined {
  const headers = request.headers

  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  return undefined
}
