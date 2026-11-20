import type { CatalogFiling, CompanyCatalog } from '@/lib/filings/types'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FilingChat } from '../FilingChat'

const listOrgSubscriptions = vi.fn()

vi.mock('@robosystems/core', () => ({
  ReportChat: ({
    available,
    unavailable,
    hint,
  }: {
    available: boolean
    unavailable: React.ReactNode
    hint: string
  }) => (
    <div>
      <span>{hint}</span>
      {available ? <span>chat open</span> : <div>{unavailable}</div>}
    </div>
  ),
  SDK: {
    listOrgSubscriptions: (...args: unknown[]) => listOrgSubscriptions(...args),
  },
  unwrapSdk: (result: { data: unknown }) => result.data,
  onlyRepositories: () => true,
  useGraphContext: () => ({ state: { graphs: [{ graphId: 'sec' }] } }),
  useOrg: () => ({ currentOrg: { id: 'org_1' } }),
  useUser: () => ({ user: { id: 'u1' } }),
}))

// A fictional filer.
const company = { name: 'Northwind Tooling', ticker: 'NWTL' } as CompanyCatalog
const filing = {
  form: '10-K',
  accession: '0001234567-26-000001',
} as CatalogFiling

const seat = (trial_ends_at: string | null) => ({
  data: [{ resource_type: 'repository', resource_id: 'sec', trial_ends_at }],
})

describe('FilingChat', () => {
  beforeEach(() => listOrgSubscriptions.mockReset())

  it('takes questions from a paid SEC subscription', async () => {
    listOrgSubscriptions.mockResolvedValue(seat(null))
    render(<FilingChat company={company} filing={filing} />)
    expect(await screen.findByText('chat open')).toBeInTheDocument()
    expect(screen.queryByText(/start your plan now/)).toBeNull()
  })

  it('points a trial at the plan instead of taking a question the API refuses', async () => {
    listOrgSubscriptions.mockResolvedValue(seat('2999-01-01T00:00:00'))
    render(<FilingChat company={company} filing={filing} />)
    const link = await screen.findByRole('link', {
      name: 'start your plan now',
    })
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('/organization?tab=subscriptions')
    )
    expect(screen.getByText('Opens with your plan')).toBeInTheDocument()
    expect(screen.queryByText('chat open')).toBeNull()
  })
})
