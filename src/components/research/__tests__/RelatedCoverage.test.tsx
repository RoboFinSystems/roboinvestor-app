import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CoverageItem } from '@/lib/research/types'
import { RelatedCoverage } from '../RelatedCoverage'

const item = (
  ticker: string,
  company: string,
  title: string
): CoverageItem => ({
  ticker,
  company,
  title,
  summary: '',
  tags: [],
  date: '2026-11-01',
  version: '2026-Q4',
  assets: {},
  history: [],
})

describe('RelatedCoverage', () => {
  it('links each report by company name, to its lower-case page', () => {
    render(
      <RelatedCoverage
        related={{
          label: 'Payroll & HCM',
          hub: null,
          items: [item('PCTY', 'Paylocity', 'Paylocity Q3 2026')],
        }}
      />
    )
    expect(
      screen.getByRole('heading', { name: 'More coverage in Payroll & HCM' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Paylocity (PCTY)' })
    ).toHaveAttribute('href', '/research/pcty')
    expect(screen.getByText('Paylocity Q3 2026')).toBeInTheDocument()
  })

  it('links the sector report when there is one', () => {
    render(
      <RelatedCoverage
        related={{
          label: 'US Operators',
          hub: item('CANNABIS', 'U.S. Cannabis Sector', 'The cannabis sector'),
          items: [],
        }}
      />
    )
    expect(
      screen.getByRole('link', { name: 'The cannabis sector' })
    ).toHaveAttribute('href', '/research/cannabis')
  })

  it('renders nothing without related reports', () => {
    const { container } = render(<RelatedCoverage related={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
