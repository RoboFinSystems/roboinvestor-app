import { afterEach, describe, expect, it, vi } from 'vitest'
import { archivedVersion, fetchBrief, versionSlug } from '../catalog'
import type { CoverageItem } from '../types'

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

describe('archivedVersion', () => {
  const item: CoverageItem = {
    ticker: 'HVI',
    company: 'Halvorsen Instruments Corp',
    title: 'The latest report',
    summary: 'Latest summary',
    tags: [],
    date: '2026-09-01',
    version: '2026-Q3',
    assets: { brief: 'https://cdn.example/HVI/HVI_brief.md' },
    history: [
      {
        version: '2026-Q2',
        date: '2026-06-01',
        title: 'The earlier report',
        summary: 'Earlier summary',
        youtube_url: 'https://youtu.be/abcdefg',
        assets: { brief: 'https://cdn.example/HVI/2026-Q2/HVI_brief.md' },
      },
    ],
  }

  it('shapes an archived version as the item it was', () => {
    const v = archivedVersion(item, versionSlug('2026-Q2'))
    expect(v).toMatchObject({
      ticker: 'HVI',
      company: 'Halvorsen Instruments Corp',
      title: 'The earlier report',
      summary: 'Earlier summary',
      date: '2026-06-01',
      version: '2026-Q2',
      youtube_url: 'https://youtu.be/abcdefg',
      history: [],
    })
    expect(v?.assets.brief).toBe('https://cdn.example/HVI/2026-Q2/HVI_brief.md')
  })

  it('has no archive entry for the current version or an unknown one', () => {
    expect(archivedVersion(item, '2026-q3')).toBeNull()
    expect(archivedVersion(item, '2025-q1')).toBeNull()
  })
})
