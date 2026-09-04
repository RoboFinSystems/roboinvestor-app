import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CompareYourCompany,
  CompareYourCompanyLine,
} from '../CompareYourCompany'

// The door out of a research page. Most of what follows is a copy guard rather than a
// render test: this block is the one place where marketing copy sits in the page shell
// and reaches all 57 reports at once, so the claims it may make are pinned here.
// Source of truth is gtm/plan.md §1.1 in the vault.

// Phrases that are false about the product. "one connector" — one MCP authorization is
// one graph, so the comps session holds the SEC graph beside the books. "read-only" —
// there is no such mode; the true statement is that nothing writes back until an entry
// is posted. A price — pricing changes and lives behind the link, never in the shell.
const FORBIDDEN = [
  /one connector/i,
  /single connector/i,
  /read[- ]only/i,
  /\$\d/,
]

describe('CompareYourCompany', () => {
  it('names the company and ticker in the offer', () => {
    render(<CompareYourCompany company="Koss Corporation" ticker="KOSS" />)
    expect(
      screen.getByRole('heading', {
        name: /compare your company to koss corporation/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/KOSS/)).toBeInTheDocument()
  })

  it('sends the primary door to RoboLedger and keeps the filings door second', () => {
    render(<CompareYourCompany company="Koss Corporation" ticker="KOSS" />)
    expect(
      screen.getByRole('link', { name: /connect your books/i })
    ).toHaveAttribute('href', 'https://roboledger.ai/register')
    expect(
      screen.getByRole('link', { name: /query the filings yourself/i })
    ).toHaveAttribute('href', 'https://robosystems.ai/pricing')
  })

  // The block does not raise writes to QuickBooks at all: the reader has not been asked
  // to connect anything yet, so there is no write objection to answer here, and raising
  // one manufactures it. The reassurance lives on the connect screen.
  it('does not raise the write question before the reader has been asked to connect', () => {
    const { container } = render(
      <CompareYourCompany company="Koss Corporation" ticker="KOSS" />
    )
    expect(container.textContent).not.toMatch(/writes? back/i)
  })

  it.each(FORBIDDEN)('makes no claim matching %s', (pattern) => {
    const block = render(
      <CompareYourCompany company="Koss Corporation" ticker="KOSS" />
    )
    expect(block.container.textContent).not.toMatch(pattern)
    const line = render(<CompareYourCompanyLine />)
    expect(line.container.textContent).not.toMatch(pattern)
  })
})

describe('CompareYourCompanyLine', () => {
  it('carries the same two doors on the catalog page', () => {
    render(<CompareYourCompanyLine />)
    expect(
      screen.getByRole('link', { name: /connect your books/i })
    ).toHaveAttribute('href', 'https://roboledger.ai/register')
    expect(
      screen.getByRole('link', { name: /query the filings yourself/i })
    ).toHaveAttribute('href', 'https://robosystems.ai/pricing')
  })
})
