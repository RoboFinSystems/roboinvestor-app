import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const get = (q: string) =>
  new NextRequest(`https://roboinvestor.ai/api/companies/search?q=${q}`)

const index = {
  companies: [{ ticker: 'ACME', name: 'Acme Widgets', cik: '1' }],
}

describe('GET /api/companies/search', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers({ toFake: ['Date'] })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('answers from an expired cache without waiting on a stalled refresh', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json(index))
      .mockImplementation(() => new Promise(() => {}))
    vi.stubGlobal('fetch', fetchMock)
    const { GET } = await import('../route')

    expect((await GET(get('acme'))).status).toBe(200)
    vi.setSystemTime(Date.now() + 2 * 60 * 60 * 1000)

    const res = await Promise.race([
      GET(get('acme')),
      new Promise<'timeout'>((r) => setTimeout(() => r('timeout'), 200)),
    ])
    expect(res).not.toBe('timeout')
    expect((res as Response).status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('bounds the index fetch with a timeout', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(index))
    vi.stubGlobal('fetch', fetchMock)
    const { GET } = await import('../route')
    await GET(get('acme'))
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal)
  })
})
