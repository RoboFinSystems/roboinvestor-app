import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchBrief } from '../catalog'

describe('fetchBrief', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('reads a brief the CDN does not have as none', async () => {
    for (const status of [403, 404]) {
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => new Response('', { status }))
      )
      await expect(fetchBrief('https://cdn.example/b.md')).resolves.toBe('')
    }
  })

  it('throws on an outage', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 503 }))
    )
    await expect(fetchBrief('https://cdn.example/b.md')).rejects.toThrow(
      'Brief fetch failed'
    )
  })
})
