import type * as Docs from '@/lib/docs'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockGetAllCoverage = vi.fn()
const mockGetDocsCatalog = vi.fn()

vi.mock('@/lib/research', () => ({
  getAllCoverage: () => mockGetAllCoverage(),
}))

vi.mock('@/lib/docs', async (importOriginal) => ({
  ...(await importOriginal<typeof Docs>()),
  getDocsCatalog: () => mockGetDocsCatalog(),
}))

import { GET } from '../route'

describe('GET /llms.txt', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('maps the docs and the research coverage', async () => {
    mockGetDocsCatalog.mockResolvedValue({
      schema_version: 1,
      digest: '',
      collections: [
        {
          site: 'roboinvestor',
          layer: 'product',
          base_path: '/docs',
          sections: [{ title: null, slugs: ['your-portfolio'] }],
        },
      ],
      pages: [
        {
          site: 'roboinvestor',
          layer: 'product',
          slug: 'your-portfolio',
          path: '/docs/your-portfolio',
          title: 'Your portfolio',
          description: 'Holdings and performance.',
          section: null,
          order: 0,
          updated: null,
          body: '',
          source_url: '',
        },
      ],
    })
    mockGetAllCoverage.mockResolvedValue([
      {
        ticker: 'PTON',
        company: 'Peloton',
        title: 'Peloton: the turnaround',
        summary: 'Subscribers and churn.',
        tags: [],
        date: '2026-09-01',
        version: '2026-Q2',
        assets: {},
      },
    ])

    const body = await (await GET()).text()

    expect(body.startsWith('# RoboInvestor\n\n> ')).toBe(true)
    expect(body).toContain(
      '- [Your portfolio](https://roboinvestor.ai/docs/your-portfolio): Holdings and performance.'
    )
    expect(body).toContain(
      '- [Peloton: the turnaround](https://roboinvestor.ai/research/pton): Subscribers and churn.'
    )
    expect(body).toContain('https://robosystems.ai/about')
  })
})
