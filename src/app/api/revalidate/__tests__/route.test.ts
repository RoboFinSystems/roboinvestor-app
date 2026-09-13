import type { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const revalidatePath = vi.hoisted(() => vi.fn())
vi.mock('next/cache', () => ({ revalidatePath }))

const SECRET = 'a-shared-secret-value'

/** A POST to the route with an optional bearer token. */
function post(body: unknown, token?: string): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json' })
  if (token) headers.set('authorization', `Bearer ${token}`)
  return new Request('https://roboinvestor.ai/api/revalidate', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }) as unknown as NextRequest
}

describe('POST /api/revalidate', () => {
  const original = process.env.REVALIDATE_SECRET

  beforeEach(() => {
    revalidatePath.mockClear()
    process.env.REVALIDATE_SECRET = SECRET
  })

  afterEach(() => {
    process.env.REVALIDATE_SECRET = original
  })

  it('revalidates the research page for each ticker', async () => {
    const { POST } = await import('../route')
    const res = await POST(post({ tickers: ['INTU', 'avav'] }, SECRET))

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      revalidated: ['/research/intu', '/research/avav'],
      rejected: [],
    })
    expect(revalidatePath).toHaveBeenCalledWith('/research/intu')
    expect(revalidatePath).toHaveBeenCalledWith('/research/avav')
  })

  it('accepts the hub, the home page and the sitemap by path', async () => {
    const { POST } = await import('../route')
    const res = await POST(
      post({ paths: ['/research', '/', '/sitemap.xml'] }, SECRET)
    )

    await expect(res.json()).resolves.toEqual({
      revalidated: ['/research', '/', '/sitemap.xml'],
      rejected: [],
    })
  })

  it('rejects a path outside the research surface without revalidating it', async () => {
    const { POST } = await import('../route')
    const res = await POST(
      post({ paths: ['/settings', '/research/intu/../../home'] }, SECRET)
    )

    const body = (await res.json()) as {
      revalidated: string[]
      rejected: string[]
    }
    expect(body.revalidated).toEqual([])
    expect(body.rejected).toEqual(['/settings', '/research/intu/../../home'])
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('deduplicates paths a caller sends twice', async () => {
    const { POST } = await import('../route')
    const res = await POST(
      post({ tickers: ['intu'], paths: ['/research/intu'] }, SECRET)
    )

    await expect(res.json()).resolves.toEqual({
      revalidated: ['/research/intu'],
      rejected: [],
    })
    expect(revalidatePath).toHaveBeenCalledTimes(1)
  })

  it('refuses a wrong secret', async () => {
    const { POST } = await import('../route')
    const res = await POST(post({ tickers: ['intu'] }, 'wrong'))

    expect(res.status).toBe(401)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('refuses a missing Authorization header', async () => {
    const { POST } = await import('../route')
    const res = await POST(post({ tickers: ['intu'] }))

    expect(res.status).toBe(401)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('is closed, not open, when no secret is configured', async () => {
    delete process.env.REVALIDATE_SECRET
    const { POST } = await import('../route')
    const res = await POST(post({ tickers: ['intu'] }))

    expect(res.status).toBe(503)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('rejects an empty request and a body with nothing to revalidate', async () => {
    const { POST } = await import('../route')
    expect((await POST(post('not json', SECRET))).status).toBe(400)
    expect((await POST(post({}, SECRET))).status).toBe(400)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('bounds how much one call can queue', async () => {
    const { POST } = await import('../route')
    const tickers = Array.from({ length: 501 }, (_, i) => `t${i}`)
    const res = await POST(post({ tickers }, SECRET))

    expect(res.status).toBe(400)
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
