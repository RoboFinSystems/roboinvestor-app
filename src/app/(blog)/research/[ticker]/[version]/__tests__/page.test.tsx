import type * as ResearchLib from '@/lib/research'
import type { CoverageItem } from '@/lib/research'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/research', async (importOriginal) => ({
  ...(await importOriginal<typeof ResearchLib>()),
  getCoverage: vi.fn(),
  getAllCoverage: vi.fn().mockResolvedValue([]),
  fetchBrief: vi.fn(),
}))
// The top bar reads the session, which this page does not otherwise touch.
vi.mock('@/components/research/ResearchTopBar', () => ({
  ResearchTopBar: () => null,
}))
// The real ones throw to stop rendering; the mocks do the same so the page stops there.
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND')
  }),
  permanentRedirect: vi.fn((to: string) => {
    throw new Error(`REDIRECT ${to}`)
  }),
}))

import { fetchBrief, getCoverage } from '@/lib/research'
import ResearchVersionPage, { generateMetadata } from '../page'

// A fictional filer covered twice.
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
      assets: { brief: 'https://cdn.example/HVI/2026-Q2/HVI_brief.md' },
    },
  ],
}

const params = (version: string) => Promise.resolve({ ticker: 'hvi', version })

describe('/research/[ticker]/[version]', () => {
  beforeEach(() => {
    vi.mocked(getCoverage).mockResolvedValue(item)
    vi.mocked(fetchBrief).mockResolvedValue(
      '# The earlier report\n\nWhat the earlier filing showed.\n'
    )
  })

  it('renders the archived brief and points to the latest report', async () => {
    render(await ResearchVersionPage({ params: params('2026-q2') }))
    expect(
      screen.getByRole('heading', { level: 1, name: 'The earlier report' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('What the earlier filing showed.')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /read the latest HVI report/i })
    ).toHaveAttribute('href', '/research/hvi')
    expect(fetchBrief).toHaveBeenCalledWith(
      'https://cdn.example/HVI/2026-Q2/HVI_brief.md',
      3600
    )
  })

  it('is canonical to itself, not to the latest report', async () => {
    const meta = await generateMetadata({ params: params('2026-Q2') })
    expect(meta.alternates?.canonical).toBe(
      'https://roboinvestor.ai/research/hvi/2026-q2'
    )
    expect(meta.title).toBe('The earlier report | RoboInvestor Research')
  })

  it('sends the current version to the ticker page', async () => {
    await expect(
      ResearchVersionPage({ params: params('2026-q3') })
    ).rejects.toThrow('REDIRECT /research/hvi')
  })

  it('is not found for a version that was never published', async () => {
    await expect(
      ResearchVersionPage({ params: params('2025-q1') })
    ).rejects.toThrow('NOT_FOUND')
  })

  it('is not found when the archived brief is gone', async () => {
    vi.mocked(fetchBrief).mockResolvedValue('')
    await expect(
      ResearchVersionPage({ params: params('2026-q2') })
    ).rejects.toThrow('NOT_FOUND')
  })
})
