import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import DocsLink from '../DocsLink'

describe('DocsLink', () => {
  it('points at the given docs page in a new tab', () => {
    render(<DocsLink href="/docs/your-portfolio" />)

    const link = screen.getByRole('link', { name: /Read the guide/ })
    expect(link).toHaveAttribute('href', '/docs/your-portfolio')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link.textContent).toContain('(opens in a new tab)')
  })

  it('never wraps, so the arrow cannot land alone on a line', () => {
    render(<DocsLink href="/docs/your-portfolio" />)

    expect(screen.getByRole('link')).toHaveClass('whitespace-nowrap')
  })

  it('reads the same wherever it lands', () => {
    const { rerender } = render(<DocsLink href="/docs/reports-you-receive" />)
    expect(screen.getByRole('link')).toHaveTextContent('Read the guide →')

    rerender(<DocsLink href="/docs/research-and-sec-filings" />)
    expect(screen.getByRole('link')).toHaveTextContent('Read the guide →')
  })
})
