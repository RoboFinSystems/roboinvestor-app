import { afterEach, describe, expect, it, vi } from 'vitest'

const mockGetAllCoverage = vi.fn()

vi.mock('@/lib/research', () => ({
  getAllCoverage: () => mockGetAllCoverage(),
}))
vi.mock('@/lib/research-site', () => ({
  RESEARCH_IS_CANONICAL_HERE: true,
  SELF_ORIGIN: 'https://roboinvestor.ai',
}))

import sitemap from '../sitemap'

const coverage = [
  { ticker: 'MSFT', date: '2026-07-30' },
  { ticker: 'SBUX', date: '2026-07-28' },
  { ticker: 'NEW' },
]

// A lastmod is a real date or absent. A date stamped at request time teaches Bing and
// Google to ignore the field on every entry, including the research pages whose dates
// are true.
describe('sitemap', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('sends no lastmod for the homepage or a covered company with no date', async () => {
    mockGetAllCoverage.mockResolvedValue(coverage)
    const byUrl = new Map((await sitemap()).map((e) => [e.url, e]))

    expect(byUrl.get('https://roboinvestor.ai')?.lastModified).toBeUndefined()
    expect(byUrl.has('https://roboinvestor.ai/research/new')).toBe(true)
    expect(
      byUrl.get('https://roboinvestor.ai/research/new')?.lastModified
    ).toBeUndefined()
  })

  it('dates the research hub by its newest report and each page by its own', async () => {
    mockGetAllCoverage.mockResolvedValue(coverage)
    const byUrl = new Map((await sitemap()).map((e) => [e.url, e.lastModified]))

    expect(byUrl.get('https://roboinvestor.ai/research')).toEqual(
      new Date('2026-07-30')
    )
    expect(byUrl.get('https://roboinvestor.ai/research/sbux')).toEqual(
      new Date('2026-07-28')
    )
  })

  it('sends no lastmod for the hub when coverage is unreachable', async () => {
    mockGetAllCoverage.mockRejectedValue(new Error('catalog down'))
    const hub = (await sitemap()).find(
      (e) => e.url === 'https://roboinvestor.ai/research'
    )

    expect(hub?.lastModified).toBeUndefined()
  })

  it('is byte-identical across fetches', async () => {
    mockGetAllCoverage.mockResolvedValue(coverage)
    const first = JSON.stringify(await sitemap())
    await new Promise((resolve) => setTimeout(resolve, 5))

    expect(JSON.stringify(await sitemap())).toEqual(first)
  })
})
