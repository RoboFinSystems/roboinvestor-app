import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AskTheFiling, AskTheFilingLine, TRIAL_HREF } from '../AskTheFiling'

// The trial block sits in the page shell and reaches every report at once, so the claims
// it may make are pinned here. It is a trial: never a free tier or a free plan, and no
// price, which changes and lives behind the link.
const FORBIDDEN = [/free tier/i, /free plan/i, /free forever/i, /\$\d/]

describe('AskTheFiling', () => {
  it("shows the brief's own prompt when it has one", () => {
    render(
      <AskTheFiling
        company="Halvorsen Instruments Corp"
        prompt="How did free cash flow change in 2026?"
      />
    )
    expect(
      screen.getByText('How did free cash flow change in 2026?')
    ).toBeInTheDocument()
  })

  it('falls back to a prompt that names the company', () => {
    render(<AskTheFiling company="Halvorsen Instruments Corp" prompt={null} />)
    expect(
      screen.getByText(/Show Halvorsen Instruments Corp's income statement/)
    ).toBeInTheDocument()
  })

  it('links to where the trial starts and offers a copy button', () => {
    render(<AskTheFiling company="Halvorsen Instruments Corp" />)
    expect(
      screen.getByRole('link', { name: /start the 14-day trial/i })
    ).toHaveAttribute('href', TRIAL_HREF)
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('makes no claim the trial does not support', () => {
    const { container } = render(
      <>
        <AskTheFiling company="Halvorsen Instruments Corp" />
        <AskTheFilingLine />
      </>
    )
    for (const phrase of FORBIDDEN) {
      expect(container.textContent).not.toMatch(phrase)
    }
  })
})
