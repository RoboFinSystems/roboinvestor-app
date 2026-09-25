import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { proxy } from '../proxy'

const connectSrc = (res: Response) =>
  (res.headers.get('content-security-policy') ?? '')
    .split('; ')
    .find((d) => d.startsWith('connect-src')) ?? ''

describe('proxy CSP connect-src', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('allows the API this deployment is configured for', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_ROBOSYSTEMS_API_URL', 'https://api.corp.example/v1')
    const res = proxy(new NextRequest('https://ledger.corp.example/home'))
    expect(connectSrc(res)).toContain('https://api.corp.example')
    expect(connectSrc(res)).not.toContain('/v1')
  })

  it('ignores an unreplaced placeholder', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv(
      'NEXT_PUBLIC_ROBOSYSTEMS_API_URL',
      '__PLACEHOLDER_ROBOSYSTEMS_API_URL__'
    )
    const res = proxy(new NextRequest('https://roboinvestor.ai/home'))
    expect(connectSrc(res)).not.toContain('PLACEHOLDER')
  })
})
